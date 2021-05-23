-- seed department table 
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Human Resources");
INSERT INTO department (name)
VALUES ("Tech");
INSERT INTO department (name)
VALUES ("Finance");

-- seed role table 
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Advisor", 23000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 42000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Advisor", 36000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("HR Manager", 55000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Junior Software Engineer", 30000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Software Engineer", 70000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 32000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Chief Financial Operator", 90000, 4);

-- seed employee table 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alice", "Green", 4, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Grady", 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Susan", "Jones", 8, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gracie", "Johnson", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Katie", "Simmonds", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Betty", "Sylvester", 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andy", "Roberts", 5, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Barbara", "Jackson", 5, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tim", "Bond", 7, 4);