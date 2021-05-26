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
          short: "Employees By Department",
          value: "viewAllEmployeesByDepartment",
          name: "View All Employees By Department",
        },
        {
          short: "Employees By Role",
          value: "viewAllEmployeesByRole",
          name: "View All Employees By Role",
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

    if (option === "viewAllEmployeesByDepartment") {
      const query = await db.query(
        "SELECT department, title, salary, first_name, last_name FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id"
      );
      console.table(query);
    }

    if (option === "viewAllEmployeesByRole") {
      const query = await db.query(
        "SELECT title, salary, department, first_name, last_name FROM role LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id"
      );
      console.table(query);
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
      // const allEmployees = await db.selectAll("employee");
      // const question = [
      //   {
      //     type: "list",
      //     message: "Please select the employee you would like to remove.",
      //     name: "employeeId",
      //     choices: generateEmployees(allEmployees),
      //   },
      // ];
      // const { employeeId } = await getAnswers(question);
      // await db.parameterisedQuery(`DELETE FROM employee WHERE ?? = "?"`, [
      //   (id = employeeId),
      // ]);
      // const query2 = await getAllEmployees(db);
      // console.table(query2);
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

    if (option === "exit") {
      inProgress = false;
      await db.end();
    }
  }
};

init();
