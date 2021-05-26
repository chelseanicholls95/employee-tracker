const getAllEmployees = async (db) => {
  const query = await db.query(
    "SELECT first_name, last_name, title, salary, department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id"
  );

  return query;
};

const getAllRoles = async (db) => {
  const query = await db.query(
    "SELECT title, salary, department FROM role LEFT JOIN department ON role.department_id = department.id"
  );

  return query;
};

module.exports = { getAllEmployees, getAllRoles };
