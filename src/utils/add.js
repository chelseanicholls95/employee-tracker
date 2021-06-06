const {
  generateRoles,
  generateEmployees,
  generateDepartments,
} = require("./generateChoices");

const getAnswers = require("./getAnswers");

const addEmployee = async (db) => {
  const allRoles = await db.selectAll("role");
  const allEmployees = await db.selectAll("employee");
  const managers = allEmployees.filter((each) => each.is_manager === 1);

  const questions = [
    {
      message: "What is the first name of the employee?",
      name: "firstName",
      validate: (firstName) => firstName !== "",
    },
    {
      message: "What is the last name of the employee?",
      name: "lastName",
      validate: (lastName) => lastName !== "",
    },
    {
      type: "list",
      message: "What is the job title of the employee?",
      name: "roleId",
      choices: generateRoles(allRoles),
    },
    {
      type: "confirm",
      message: "Is this employee a manager?",
      name: "isManager",
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
      choices: generateEmployees(managers),
      when: (answers) => {
        return answers.hasManager;
      },
    },
  ];

  const { firstName, lastName, roleId, isManager, managerId } =
    await getAnswers(questions);

  await db.parameterisedQuery(
    "INSERT INTO ?? (??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)",
    [
      "employee",
      "first_name",
      "last_name",
      "role_id",
      "is_manager",
      "manager_id",
      firstName,
      lastName,
      roleId,
      isManager,
      managerId || null,
    ]
  );

  console.info(
    `Employee has been successfully added to the ${db.database} database.`
  );
};

const addRole = async (db) => {
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

  await db.parameterisedQuery("INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)", [
    "role",
    "title",
    "salary",
    "department_id",
    title,
    salary,
    departmentId,
  ]);

  console.info("Role has been successfully created.");
};

const addDepartment = async (db) => {
  const question = [
    {
      message: "What is the name of the new department?",
      name: "department",
    },
  ];

  const { department } = await getAnswers(question);

  await db.parameterisedQuery(`INSERT INTO ?? (??) VALUES (?)`, [
    "department",
    "department",
    department,
  ]);

  console.info("Department has been successfully created.");
};

module.exports = {
  addEmployee,
  addRole,
  addDepartment,
};
