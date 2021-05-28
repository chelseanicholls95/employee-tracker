const Db = require("./db");

const {
  viewAllEmployees,
  viewAllEmployeesByRole,
  viewAllEmployeesByManager,
  viewAllRoles,
  viewAllDepartments,
} = require("./controllers/viewAll");
const {
  generateRoles,
  generateEmployees,
  generateDepartments,
} = require("./utils/generateChoices");

const getAnswers = require("./utils/getAnswers");
const { addEmployee, addRole, addDepartment } = require("./controllers/add");

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
      await viewAllEmployees(db);
    }

    if (option === "viewAllEmployeesByRole") {
      await viewAllEmployeesByRole(db);
    }

    if (option === "viewAllEmployeesByManager") {
      await viewAllEmployeesByManager(db);
    }

    if (option === "addEmployee") {
      await addEmployee(db);
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

      await db.parameterisedQuery(`DELETE FROM ?? WHERE ?? = "?"`, [
        "employee",
        "id",
        employeeId,
      ]);

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
        {
          type: "confirm",
          message:
            "Would you like to change the managerial status of this employee?",
          name: "updateIsManager",
        },
        {
          type: "confirm",
          message: "Is this employee a manager?",
          name: "isManager",
          when: (answer) => {
            return answer.updateIsManager;
          },
        },
      ];

      const { firstName, lastName, employeeId, isManager } = await getAnswers(
        questions
      );
      const query = `UPDATE ?? SET ?? = ? WHERE ?? = "?";`;
      const query2 = `UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = "?";`;

      if (!firstName && lastName) {
        await db.parameterisedQuery(query, [
          "employee",
          "last_name",
          lastName,
          "id",
          employeeId,
        ]);
      } else if (!lastName && firstName) {
        await db.parameterisedQuery(query, [
          "employee",
          "first_name",
          firstName,
          "id",
          employeeId,
        ]);
      } else if (firstName && lastName) {
        await db.parameterisedQuery(query2, [
          "employee",
          "first_name",
          firstName,
          "last_name",
          lastName,
          "id",
          employeeId,
        ]);
      }

      if (isManager) {
        query, ["employee", "is_manager", isManager, "id", employeeId];
      }

      console.info("Employee successfully updated.");
    }

    if (option === "updateEmployeeRole") {
      const allEmployees = await db.selectAll("employee");
      const allRoles = await db.selectAll("role");

      const questions = [
        {
          type: "list",
          message: "Which employee would you like to update?",
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

      await db.parameterisedQuery(`UPDATE ?? SET ?? = ? WHERE ?? = "?";`, [
        "employee",
        "role_id",
        roleId,
        "id",
        employeeId,
      ]);

      console.info("Employee's role has been successfully updated.");
    }

    if (option === "updateEmployeeManager") {
      const allEmployees = await db.selectAll("employee");
      const managers = allEmployees.filter((each) => {
        return each.is_manager === 1;
      });

      const questions = [
        {
          type: "list",
          message: "Select the employee you would like to update.",
          name: "employeeId",
          choices: generateEmployees(allEmployees),
        },
        {
          type: "list",
          message: "Who is the employee's new manager?",
          name: "managerId",
          choices: generateEmployees(managers),
        },
      ];

      const { employeeId, managerId } = await getAnswers(questions);

      await db.parameterisedQuery(`UPDATE ?? SET ?? = ? WHERE ?? = "?";`, [
        "employee",
        "manager_id",
        managerId,
        "id",
        employeeId,
      ]);

      console.info("Employee's manager has been successfully updated.");
    }

    if (option === "viewAllRoles") {
      await viewAllRoles(db);
    }

    if (option === "addRole") {
      await addRole(db);
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
      await viewAllDepartments(db);
    }

    if (option === "addDepartment") {
      await addDepartment(db);
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
      const allDepartments = await db.selectAll("department");

      const question = [
        {
          type: "list",
          message:
            "Please select which department you would like to view the budget for.",
          name: "departmentId",
          choices: generateDepartments(allDepartments),
        },
      ];

      const { departmentId } = await getAnswers(question);

      const query = await db.parameterisedQuery(
        `SELECT SUM(??) FROM ?? WHERE ?? = "?";`,
        ["salary", "role", "department_id", departmentId]
      );

      console.table(query);
    }

    if (option === "exit") {
      inProgress = false;
      await db.end();
    }
  }
};

init();
