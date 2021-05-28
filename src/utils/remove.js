const {
  generateRoles,
  generateEmployees,
  generateDepartments,
} = require("./generateChoices");

const getAnswers = require("./getAnswers");

const removeEmployee = async (db) => {
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
};

const removeRole = async (db) => {
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
};

const removeDepartment = async (db) => {
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
};

module.exports = {
  removeEmployee,
  removeRole,
  removeDepartment,
};
