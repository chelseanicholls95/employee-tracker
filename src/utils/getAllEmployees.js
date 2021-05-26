const getAllEmployees = async (db) => {
  const query = await db.query(
    "SELECT first_name, last_name, title, salary, department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id"
  );

  return query;
};

module.exports = getAllEmployees;
