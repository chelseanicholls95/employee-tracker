const generateRoles = (roles) =>
  roles.map((role) => ({
    short: role.id,
    name: role.title,
    value: role.id,
  }));

const generateEmployees = (employees) =>
  employees.map((employee) => ({
    short: employee.id,
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));

const generateDepartments = (departments) =>
  departments.map((department) => ({
    short: department.id,
    name: department.department,
    value: department.id,
  }));

module.exports = {
  generateRoles,
  generateEmployees,
  generateDepartments,
};
