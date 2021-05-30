const { generateRoles, generateEmployees } = require("./generateChoices");

const getAnswers = require("./getAnswers");

const updateEmployee = async (db) => {
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
      validate: (firstName) => firstName !== "",
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
      validate: (updateLastName) => updateLastName !== "",
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
    await db.parameterisedQuery(query, [
      "employee",
      "is_manager",
      isManager,
      "id",
      employeeId,
    ]);
  }

  console.info("Employee successfully updated.");
};

const updateEmployeeRole = async (db) => {
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
};

const updateEmployeeManager = async (db) => {
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
};

module.exports = {
  updateEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
};
