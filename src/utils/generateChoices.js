const generateRoles = (roles) => {
  return roles.map((role) => {
    return {
      short: role.id,
      name: role.title,
      value: role.id,
    };
  });
};

const generateEmployees = (employees) => {
  return employees.map((employee) => {
    return {
      short: employee.id,
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    };
  });
};

const generateDepartments = (departments) => {
  return departments.map((department) => {
    return {
      short: department.id,
      name: department.department,
      value: department.id,
    };
  });
};

module.exports = {
  generateRoles,
  generateEmployees,
  generateDepartments,
};
