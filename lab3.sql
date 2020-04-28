/*
 * Stephen Crowe, Shikhar Sinha
 * Prof. Pierson
 * CS61: Databases
 * 27 April 2020
*/

USE nyc_inspections;

/* Create new database user for use with api */
DROP USER IF EXISTS 'inspector'@'localhost';
CREATE USER IF NOT EXISTS 'inspector'@'localhost' IDENTIFIED BY 'inspector';
GRANT SELECT, UPDATE, INSERT, DELETE ON nyc_inspections.employees TO 'inspector'@'localhost';
ALTER USER 'inspector'@'localhost' IDENTIFIED WITH mysql_native_password BY 'inspector';
FLUSH PRIVILEGES;

/* Create the Employees table */
DROP TABLE IF EXISTS Employees;
CREATE TABLE IF NOT EXISTS Employees(
	EmployeeId BINARY(16),
    Username Varchar(45) UNIQUE,
    Psswrd BINARY(60),
	HireDate DATE,
    Salary INT,
    IsAdmin BOOLEAN DEFAULT FALSE,
    Salt BINARY(32),
    PRIMARY KEY(EmployeeId),
    CONSTRAINT MinSal CHECK (Salary > 0)
);

/*
 * Seed the database with two different users. 
 * 1. A superuser with username = 'admin' and password = 'admin'.
 * 2. A regular user with username = 'user' and password = 'user'.
*/
INSERT INTO Employees SET `EmployeeId` = UUID_TO_BIN('cbc71174-88c7-11ea-8466-4641768d6037', true), `Psswrd` = '$2a$10$4EokNhAw0u7FRpF7DK91LuDgHsMsGL//Qfbx5EpOKgBa01T71lS6K', `Salt` = '$2a$10$4EokNhAw0u7FRpF7DK91Lu', `Username` = 'admin', `HireDate` = '2018-09-09', `Salary` = 500, `IsAdmin` = 1;
INSERT INTO Employees SET `EmployeeId` = UUID_TO_BIN('ef1befaa-88c7-11ea-8466-4641768d6037', true), `Psswrd` = '$2a$10$Tv40XxgYYiqAC4ASfU5hV.5yEDOhC7lRgFHjWyFa.Y7ewYy/wg232', `Salt` = '$2a$10$Tv40XxgYYiqAC4ASfU5hV.', `Username` = 'user', `HireDate` = '2019-04-04', `Salary` = 20, `IsAdmin` = 0;

SELECT BIN_TO_UUID(EmployeeId, true) AS EmployeeID, Username, HireDate, Salary, IsAdmin FROM Employees;