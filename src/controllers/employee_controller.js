import mysql from 'mysql';
import db from '../db';
import createMySqlDate from '../utils/format';
import { genSaltedPassword } from '../utils/encrypt';

const INSERT = 'INSERT INTO Employees SET ?';
const SELECT_NEW_UUID = 'SELECT UUID()';
export const createEmployee = (req, res) => {
  const hiredate = req.body.HireDate ? new Date(req.body.HireDate) : new Date();
  const result = {
    Username: req.body.Username,
    // HireDate: createMySqlDate(hiredate),
    Salary: req.body.Salary,
    IsAdmin: req.body.IsAdmin ? req.body.IsAdmin : 0, // Default to 0
  };
  let uuid = '';
  db.query(SELECT_NEW_UUID)
    .then((uuidResults) => {
      uuid = uuidResults[0]['UUID()'];
      const passwordObj = genSaltedPassword(req.body.Password);
      const em = Object.assign({
        EmployeeId: mysql.raw(`UUID_TO_BIN('${uuid}', true)`),
      }, passwordObj, result);
      result.EmployeeId = uuid;
      return db.query(INSERT, em);
    })
    .then(() => {
      res.json({ status: 200, error: null, response: result });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
    });
};

const SELECT_ALL = `
SELECT BIN_TO_UUID(EmployeeId, true) AS EmployeeID, 
Username, HireDate, Salary, IsAdmin 
FROM Employees
`;
const SELECT_WHERE = `${SELECT_ALL}
WHERE ?`;
export const getEmployees = (req, res) => {
  console.log(req.query);
  if (Object.keys(req.query).length === 0) {
    db.query(SELECT_ALL)
      .then((result) => {
        res.json({ status: 200, error: null, response: result });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: 500, error: err.sqlMessage, response: null });
      });
  } else {
    let query = [];
    Object.entries(req.query).forEach(([k, v]) => {
      query.push(`${k} = '${v}'`);
    });
    query = mysql.raw(query.join(' AND '));
    db.query(SELECT_WHERE, query)
      .then((result) => {
        res.json({ status: 200, error: null, response: result });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: 500, error: err.sqlMessage, response: null });
      });
  }
};

const WHERE_ID = 'WHERE EmployeeId = UUID_TO_BIN(?, true)';
const SELECT_BY_ID = `${SELECT_ALL} ${WHERE_ID}`;
export const getEmployee = (req, res) => {
  db.query(SELECT_BY_ID, req.params.id)
    .then((result) => {
      res.json({ status: 200, error: null, response: result });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
    });
};

const UPDATE_BY_ID = `UPDATE Employees SET ? ${WHERE_ID}`;
export const updateEmployee = (req, res) => {
  const update = req.body;
  if (req.body.Password) {
    const passwordObj = genSaltedPassword(req.body.Password);
    // const Salt = bcrypt.genSaltSync(10);
    // const Psswrd = bcrypt.hashSync(req.body.Password, Salt);
    Object.assign(update, passwordObj);
  }
  if (req.body.HireDate) {
    const hd = new Date(req.body.HireDate);
    if (hd instanceof Date && !Number.isNaN(hd.getTime())) {
      Object.assign(update, { HireDate: createMySqlDate(hd) });
    } else {
      return res.json({
        status: 400,
        error: 'invalid HireDate',
        response: null,
      });
    }
  }
  db.query(UPDATE_BY_ID, [update, req.params.id])
    .then((result) => {
      res.json({ status: 200, error: null, response: result });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
    });
};

const DELETE_BY_ID = `DELETE FROM Employees ${WHERE_ID}`;
export const deleteEmployee = (req, res) => {
  db.query(DELETE_BY_ID, req.params.id)
    .then((result) => {
      res.json({ status: 200, error: null, response: result });
    })
    .catch((err) => {
      console.log(err);
      res.json({ status: 500, error: err.sqlMessage, response: null });
    });
};
