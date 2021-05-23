const inquirer = require("inquirer");
const Db = require("./db");

const init = async () => {
  const db = new Db("company_db");

  await db.start();

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

  const { option } = await inquirer.prompt(optionsQuestion);
  console.log(option);

  await db.end();
};
init();
