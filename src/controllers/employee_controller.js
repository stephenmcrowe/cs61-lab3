/* eslint-disable consistent-return */
import mysql from 'mysql';
import db from '../db';
import { createMySqlDate } from '../utils/format';
import { genSaltedPassword } from '../utils/encrypt';

/*
 * The route for creating an employee
 * Expects POST json body in the following format:
 * {
 *    Username: str,
 *    Password: str,
 *    HireDate: str, '%Y-%m-%d' format
 *    Salary: int, > 0
 *    IsAdmin: int, 1 or 0
 * }
 *
 * Returns the created employee as json or error
 */
const INSERT = 'INSERT INTO Employees SET ?';
const SELECT_NEW_UUID = 'SELECT UUID()';
export const createEmployee = (req, res) => {
  // Cannot create an employee unless admin
  if (req.user && !req.user.IsAdmin) {
    return res.status(403).json({ error: 'Unauthorized', response: null });
  }

  // Data massaging for MYSQL
  const hiredate = req.body.HireDate ? new Date(req.body.HireDate) : new Date();
  const result = {
    Username: req.body.Username,
    HireDate: createMySqlDate(hiredate),
    Salary: req.body.Salary,
    IsAdmin: req.body.IsAdmin ? req.body.IsAdmin : 0, // Default to 0
  };

  // Get new UUID
  let uuid = '';
  db.query(SELECT_NEW_UUID)
    .then((uuidResults) => {
      uuid = uuidResults[0]['UUID()'];
      const passwordObj = genSaltedPassword(req.body.Password);
      const em = Object.assign({
        EmployeeId: mysql.raw(`UUID_TO_BIN('${uuid}', true)`),
      }, passwordObj, result);
      result.EmployeeId = uuid;
      // Insert using new UUID
      return db.query(INSERT, em);
    })
    .then(() => {
      res.status(200).json({ error: null, response: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.sqlMessage, response: null });
    });
};

/*
 * The route for getting all employees
 * Utilizes GET query params for searching
 * e.g. /employees?Salary=500
 *
 * Does NOT support LIKE, >=, >, or other complicated operators
 */
const SELECT_ALL = `
SELECT BIN_TO_UUID(EmployeeId, true) AS EmployeeID, 
Username, HireDate, Salary, IsAdmin 
FROM Employees
`;
const SELECT_WHERE = `${SELECT_ALL}
WHERE ?`;
export const getEmployees = (req, res) => {
  let query = [];
  // If non-admin, then can only view themselves
  if (!req.user.IsAdmin) {
    query.push(`EmployeeId = UUID_TO_BIN('${req.user.EmployeeId}', true)`);
  }
  // Parse in the query entries
  Object.entries(req.query).forEach(([k, v]) => {
    query.push(`${k} = '${v}'`);
  });

  // admin wants everything without query params
  if (query.length === 0) {
    db.query(SELECT_ALL)
      .then((result) => {
        res.status(200).json({ error: null, response: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.sqlMessage, response: null });
      });
  } else {
    query = mysql.raw(query.join(' AND '));
    db.query(SELECT_WHERE, query)
      .then((result) => {
        res.status(200).json({ error: null, response: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.sqlMessage, response: null });
      });
  }
};

/*
 * The route for getting a single employee by uuid
 * e.g. /employees/cbc71174-88c7-11ea-8466-4641768d6037
 */
const WHERE_ID = 'WHERE EmployeeId = UUID_TO_BIN(?, true)';
const SELECT_BY_ID = `${SELECT_ALL} ${WHERE_ID}`;
export const getEmployee = (req, res) => {
  // Non admin users can only see themselves
  if (!req.user.IsAdmin && req.params.id !== req.user.EmployeeId) {
    return res.status(403).json({ error: 'Unauthorized', response: null });
  }
  db.query(SELECT_BY_ID, req.params.id)
    .then((result) => {
      res.status(200).json({ error: null, response: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.sqlMessage, response: null });
    });
};

/*
 * Update an employee
 * See createEmployee for reference on the PUT json body
 *
 * Returns the affected rows. Does NOT return the modified object.
 */
const UPDATE_BY_ID = `UPDATE Employees SET ? ${WHERE_ID}`;
export const updateEmployee = (req, res) => {
  // Non admins can only update themselves
  if (!req.user.IsAdmin && req.params.id !== req.user.EmployeeId) {
    return res.status(403).json({ error: 'Unauthorized', response: null });
  }

  // Massage data for MYSQL
  const update = req.body;
  if (req.body.Password) {
    const passwordObj = genSaltedPassword(req.body.Password);
    Object.assign(update, passwordObj);
    delete update.Password;
  }
  if (req.body.HireDate) {
    const hd = new Date(req.body.HireDate);
    if (hd instanceof Date && !Number.isNaN(hd.getTime())) {
      Object.assign(update, { HireDate: createMySqlDate(hd) });
    } else {
      return res.status(400).json({
        error: 'invalid HireDate',
        response: null,
      });
    }
  }
  db.query(UPDATE_BY_ID, [update, req.params.id])
    .then(() => {
      res.status(200).json({
        error: null,
        response: 'Information updated successfully',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.sqlMessage, response: null });
    });
};

/*
 * Delete route
 */
const DELETE_BY_ID = `DELETE FROM Employees ${WHERE_ID}`;
export const deleteEmployee = (req, res) => {
  // Only admins may delete
  if (!req.user || !req.user.IsAdmin) {
    return res.status(403).json({ error: 'Unauthorized', response: null });
  }
  db.query(DELETE_BY_ID, req.params.id)
    .then((result) => {
      res.status(200).json({ error: null, response: 'Deleted successfully' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.sqlMessage, response: null });
    });
};
