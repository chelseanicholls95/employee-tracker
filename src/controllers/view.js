const {
  generateRoles,
  generateEmployees,
  generateDepartments,
} = require("../utils/generateChoices");

const getAnswers = require("../utils/getAnswers");

const viewAllEmployees = async (db) => {
  const query = await db.query(
    "SELECT first_name, last_name, title, salary, department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id"
  );

  console.table(query);
};

const viewAllEmployeesByRole = async (db) => {
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
    `SELECT ??, ?? FROM ?? WHERE ?? = "?"`,
    ["first_name", "last_name", "employee", "role_id", roleId]
  );
  console.table(query);
};

const viewAllEmployeesByManager = async (db) => {
  const allEmployees = await db.selectAll("employee");

  const managers = allEmployees.filter((each) => {
    return each.is_manager === 1;
  });

  const question = [
    {
      type: "list",
      message: "Please select a manager.",
      name: "managerId",
      choices: generateEmployees(managers),
    },
  ];

  const { managerId } = await getAnswers(question);

  const query = await db.parameterisedQuery(
    `SELECT ??, ??, ?? FROM ?? LEFT JOIN ?? ON ?? = ?? WHERE ?? = "?";`,
    [
      "first_name",
      "last_name",
      "title",
      "employee",
      "role",
      "employee.role_id",
      "role.id",
      "employee.manager_id",
      managerId,
    ]
  );

  console.table(query);
};

const viewAllRoles = async (db) => {
  const query = await db.query(
    "SELECT title, salary, department FROM role LEFT JOIN department ON role.department_id = department.id"
  );

  console.table(query);
};

const viewAllDepartments = async (db) => {
  const query = await db.query("SELECT department FROM department");

  console.table(query);
};

const viewBudget = async (db) => {
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
};

module.exports = {
  viewAllEmployees,
  viewAllEmployeesByRole,
  viewAllEmployeesByManager,
  viewAllRoles,
  viewAllDepartments,
  viewBudget,
};
