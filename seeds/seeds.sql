USE employeesDB;
INSERT INTO department(name)
VALUES 
("Dev"),
("Admin"),
("Legal"),
("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES 
("Lead Developer", 120000, 1),
("Junior Developer", 80000, 1),
("Lead Marketing", 80000, 4),
("Team Admininstrator", 60000, 2),
("Department Admininstrator", 60000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("John", "Stevenson", 2, 1),
("Steve", "Johnson", 3, 2),
("Robert", "Clarkson", 4, 2),
("Clark", "Robertson", 4, 2),
("Jane", "Maryson", 4, 2),
("Mary", "Janeson", 4, 2)