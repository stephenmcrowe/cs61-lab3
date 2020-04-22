import bcrypt from 'bcryptjs';
import mysql from 'mysql';
import connection from '../db';
import createMySqlDate from '../utils/format';

export const createEmployee = (req, res) => {
  console.log(req.body);
  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(req.body.Password, salt);
  const hiredate = req.body.HireDate ? new Date(req.body.HireDate) : new Date();
  const em = {
    EmployeeId: mysql.raw('UUID_TO_BIN(UUID(), true)'),
    Username: req.body.Username,
    Psswrd: password,
    HireDate: createMySqlDate(hiredate),
    Salary: req.body.Salary,
    IsAdmin: req.body.IsAdmin,
    Salt: salt,
  };
  console.log(em);
  connection.query('INSERT INTO Employees SET ?', em, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
      return;
    }
    console.log('results:');
    console.log(results);
    console.log('fields:');
    console.log(fields);
    res.json({ status: 200, error: null, response: results });
  });
};

export const getEmployees = (req, res) => {
  console.log(req.query);
  let query = [];
  Object.entries(req.query).forEach(([k, v]) => {
    query.push(`${k} = '${v}'`);
  });
  console.log(query);
  query = mysql.raw(query.join(' AND '));
  connection.query('SELECT * FROM Employees WHERE ?', query, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
      return;
    }
    console.log('results:');
    console.log(results);
    console.log('fields:');
    console.log(fields);
    res.json({ status: 200, error: null, response: results });
  });
};
