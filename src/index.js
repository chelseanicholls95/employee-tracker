const Db = require("./db");

const {
  generateRoles,
  generateEmployees,
  generateDepartments,
} = require("./utils/generateChoices");
const {
  getAllEmployees,
  getAllRoles,
  getAllDepartments,
} = require("./utils/getAll");
const getAnswers = require("./utils/getAnswers");

const init = async () => {
  const db = new Db("company_db");

  await db.start();

  let inProgress = true;

  while (inProgress) {
    const optionsQuestion = {
      type: "list",
      message: "Choose an option:",
      name: "option",
      choices: [
        {
          short: "Employees",
          value: "viewAllEmployees",
          name: "View All Employees",
        },
        {
          short: "Employees By Role",
          value: "viewAllEmployeesByRole",
          name: "View All Employees By Role",
        },
        {
          short: "Employees By Manager",
          value: "viewAllEmployeesByManager",
          name: "View All Employees By Manager",
        },
        {
          short: "Add Employee",
          value: "addEmployee",
          name: "Add an Employee",
        },
        {
          short: "Remove Employee",
          value: "removeEmployee",
          name: "Remove an Employee",
        },
        {
          value: "updateEmployee",
          name: "Update an Employee",
        },
        {
          value: "updateEmployeeRole",
          name: "Update Employee Role",
        },
        {
          value: "updateEmployeeManager",
          name: "Update Employee Manager",
        },
        {
          short: "Roles",
          value: "viewAllRoles",
          name: "View All Roles",
        },
        {
          value: "addRole",
          name: "Add Role",
        },
        {
          value: "removeRole",
          name: "Remove Role",
        },
        {
          short: "Departments",
          value: "viewAllDepartments",
          name: "View All Departments",
        },
        {
          value: "addDepartment",
          name: "Add Departments",
        },
        {
          value: "removeDepartment",
          name: "Remove Departments",
        },
        {
          short: "Budget",
          value: "viewBudget",
          name: "View Utilised Budget for a Department",
        },
        {
          short: "Exit",
          value: "exit",
          name: "Exit",
        },
      ],
    };

    const { option } = await getAnswers(optionsQuestion);

    if (option === "viewAllEmployees") {
      const query = await getAllEmployees(db);
      console.table(query);
    }

    if (option === "viewAllEmployeesByRole") {
      const allRoles = await db.selectAll("role");
      const question = [
        {
          type: "list",
          message: "What role would you like to view?",
          name: "roleId",
          choices: generateRoles(allRoles),
        },
      ];

      const { roleId } = await getAnswers(question);

      const query = await db.parameterisedQuery(
        `SELECT first_name, last_name FROM ?? WHERE ?? = "?"`,
        ["employee", "role_id", roleId]
      );
      console.table(query);
    }

    if (option === "viewAllEmployeesByManager") {
    }

    if (option === "addEmployee") {
      const allRoles = await db.selectAll("role");
      const allEmployees = await db.selectAll("employee");

      const questions = [
        {
          message: "What is the first name of the employee?",
          name: "firstName",
        },
        {
          message: "What is the last name of the employee?",
          name: "lastName",
        },
        {
          type: "list",
          message: "What is the job title of the employee?",
          name: "roleId",
          choices: generateRoles(allRoles),
        },
        {
          type: "confirm",
          message: "Does this employee have a manager?",
          name: "hasManager",
        },
        {
          type: "list",
          message: "Please select a manager.",
          name: "managerId",
          choices: generateEmployees(allEmployees),
          when: (answers) => {
            return answers.hasManager;
          },
        },
      ];

      let { firstName, lastName, roleId, managerId } = await getAnswers(
        questions
      );

      if (managerId === undefined) {
        managerId = null;
      }

      await db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId})`
      );
      const query2 = await getAllEmployees(db);
      console.table(query2);
    }

    if (option === "removeEmployee") {
      const allEmployees = await db.selectAll("employee");
      const question = [
        {
          type: "list",
          message: "Please select the employee you would like to remove.",
          name: "employeeId",
          choices: generateEmployees(allEmployees),
        },
      ];
      const { employeeId } = await getAnswers(question);
      await db.parameterisedQuery(
        `DELETE FROM employee WHERE ?? = "?"`,
        ["id", employeeId],
        true
      );

      console.info(`Employee removed from ${db.database} database.`);
    }

    if (option === "updateEmployee") {
      const allEmployees = await db.selectAll("employee");

      const questions = [
        {
          type: "list",
          message: "What employee would you like to update?",
          name: "employeeId",
          choices: generateEmployees(allEmployees),
        },
        {
          type: "confirm",
          message: "Would you like to update the first name of the employee?",
          name: "updateFirstName",
        },
        {
          message: "Please enter the updated first name.",
          name: "firstName",
          when: (answer) => {
            return answer.updateFirstName;
          },
        },
        {
          type: "confirm",
          message: "Would you like to update the last name of the employee?",
          name: "updateLastName",
        },
        {
          message: "Please enter the updated last name.",
          name: "lastName",
          when: (answer) => {
            return answer.updateLastName;
          },
        },
      ];

      const { firstName, lastName, employeeId } = await getAnswers(questions);

      if (firstName === undefined) {
        await db.parameterisedQuery(
          `UPDATE employee SET last_name = ? WHERE ?? = "?";`,
          [lastName, "id", employeeId]
        );
      } else if (lastName === undefined) {
        await db.parameterisedQuery(
          `UPDATE employee SET first_name = ? WHERE ?? = "?";`,
          [firstName, "id", employeeId]
        );
      } else {
        await db.parameterisedQuery(
          `UPDATE employee SET first_name = ?, last_name = ? WHERE ?? = "?";`,
          [firstName, lastName, "id", employeeId]
        );
      }

      console.info("Employee successfully updated.");
    }

    if (option === "updateEmployeeRole") {
      const allEmployees = await db.selectAll("employee");
      const allRoles = await db.selectAll("role");

      const questions = [
        {
          type: "list",
          message: "What employee would you like to update?",
          name: "employeeId",
          choices: generateEmployees(allEmployees),
        },
        {
          type: "list",
          message: "What is the employee's new role?",
          name: "roleId",
          choices: generateRoles(allRoles),
        },
      ];

      const { employeeId, roleId } = await getAnswers(questions);

      await db.parameterisedQuery(
        `UPDATE employee SET role_id = ? WHERE ?? = "?";`,
        [roleId, "id", employeeId]
      );

      console.info("Employee's role has been successfully updated.");
    }

    if (option === "viewAllRoles") {
      const query = await getAllRoles(db);
      console.table(query);
    }

    if (option === "addRole") {
      const allDepartments = await db.selectAll("department");

      const questions = [
        {
          message: "What is the title of the new role?",
          name: "title",
        },
        {
          type: "number",
          message: "What is the salary for this role?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department is the new role in?",
          name: "departmentId",
          choices: generateDepartments(allDepartments),
        },
      ];

      const { title, salary, departmentId } = await getAnswers(questions);

      const query = await db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${title}", ${salary}, ${departmentId})`
      );
      const query2 = await getAllRoles(db);
      console.table(query2);
    }

    if (option === "removeRole") {
      const allRoles = await db.selectAll("role");

      const question = [
        {
          type: "list",
          message: "Please select the role you would like to remove.",
          name: "roleId",
          choices: generateRoles(allRoles),
        },
      ];

      const { roleId } = await getAnswers(question);

      await db.parameterisedQuery(`DELETE FROM ?? WHERE ?? = "?"`, [
        "role",
        "id",
        roleId,
      ]);

      console.info(
        `Role has been successfully removed from ${db.database} database.`
      );
    }

    if (option === "viewAllDepartments") {
      const query = await getAllDepartments(db);
      console.table(query);
    }

    if (option === "addDepartment") {
      const question = [
        {
          message: "What is the name of the new department?",
          name: "department",
        },
      ];

      const { department } = await getAnswers(question);

      await db.query(
        `INSERT INTO department (department) VALUES ("${department}")`
      );
      const query2 = await getAllDepartments(db);
      console.table(query2);
    }

    if (option === "removeDepartment") {
      const allDepartments = await db.selectAll("department");

      const question = [
        {
          type: "list",
          message: "Please select the department you would like to remove.",
          name: "departmentId",
          choices: generateDepartments(allDepartments),
        },
      ];

      const { departmentId } = await getAnswers(question);

      await db.parameterisedQuery(`DELETE FROM ?? WHERE ?? = "?"`, [
        "department",
        "id",
        departmentId,
      ]);

      console.info(
        `Department has been successfully removed from ${db.database} database.`
      );
    }

    if (option === "viewBudget") {
    }

    if (option === "exit") {
      inProgress = false;
      await db.end();
    }
  }
};

init();
