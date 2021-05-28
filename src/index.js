const Db = require("./db");

const {
  viewAllEmployees,
  viewAllEmployeesByRole,
  viewAllEmployeesByManager,
  viewAllRoles,
  viewAllDepartments,
  viewBudget,
} = require("./utils/view");
const { addEmployee, addRole, addDepartment } = require("./utils/add");
const {
  removeDepartment,
  removeEmployee,
  removeRole,
} = require("./utils/remove");
const {
  updateEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
} = require("./utils/update");

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

    if (option === "exit") {
      inProgress = false;
      await db.end();
    } else {
      if (option === "viewAllEmployees") {
        await viewAllEmployees(db);
      } else if (option === "viewAllEmployeesByRole") {
        await viewAllEmployeesByRole(db);
      } else if (option === "viewAllEmployeesByManager") {
        await viewAllEmployeesByManager(db);
      } else if (option === "addEmployee") {
        await addEmployee(db);
      } else if (option === "removeEmployee") {
        await removeEmployee(db);
      } else if (option === "updateEmployee") {
        await updateEmployee(db);
      } else if (option === "updateEmployeeRole") {
        await updateEmployeeRole(db);
      } else if (option === "updateEmployeeManager") {
        await updateEmployeeManager(db);
      } else if (option === "viewAllRoles") {
        await viewAllRoles(db);
      } else if (option === "addRole") {
        await addRole(db);
      } else if (option === "removeRole") {
        await removeRole(db);
      } else if (option === "viewAllDepartments") {
        await viewAllDepartments(db);
      } else if (option === "addDepartment") {
        await addDepartment(db);
      } else if (option === "removeDepartment") {
        await removeDepartment(db);
      } else {
        await viewBudget(db);
      }
    }
  }
};

init();
