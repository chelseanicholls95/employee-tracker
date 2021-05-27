USE company_db;

-- seed department table 
INSERT INTO department (department)
VALUES ("Sales"),
("Human Resources"),
("Tech"),
("Finance");

-- seed role table 
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Advisor", 23000, 1),
("Sales Manager", 42000, 1),
("HR Advisor", 36000, 2),
("HR Manager", 55000, 2),
("Junior Software Engineer", 30000, 3),
("Lead Software Engineer", 70000, 3),
("Accountant", 32000, 4),
("Chief Financial Operator", 90000, 4);

-- seed employee table 
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 2, true, null),
("Alice", "Green", 4, true, null),
("Tom", "Grady", 6, true, null),
("Susan", "Jones", 8, true, null),
("Gracie", "Johnson", 1, false, 1),
("Katie", "Simmonds", 1, false, 1),
("Betty", "Sylvester", 3, false, 2),
("Andy", "Roberts", 5, false, 3),
("Barbara", "Jackson", 5, false, 3),
("Tim", "Bond", 7, false, 4);