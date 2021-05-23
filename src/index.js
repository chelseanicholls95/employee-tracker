const Db = require("./db");
const getAllEmployees = require("./utils/getAllEmployees");
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
        "SELECT name, title, salary, first_name, last_name FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id"
      );
      console.table(query);
    }

    if (option === "viewAllEmployeesByRole") {
      const query = await db.query(
        "SELECT title, salary, name, first_name, last_name FROM role LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id"
      );
      console.table(query);
    }

    if (option === "addEmployee") {
      await db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Judy", "Roberts", 3, 2)`
      );
      const query2 = await getAllEmployees(db);
      console.table(query2);
    }

    if (option === "viewAllRoles") {
      const query = await db.query(
        "SELECT title, salary, name FROM role LEFT JOIN department ON role.department_id = department.id"
      );
      console.table(query);
    }

    if (option === "viewAllDepartments") {
      const query = await db.query("SELECT name FROM department");
      console.table(query);
    }

    if (option === "exit") {
      inProgress = false;
      await db.end();
    }
  }
};

init();
