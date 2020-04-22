import connection from '../db';

function encrypt(password) {
  return password;
}

function createMySqlDate(date) {
  return date.toLocaleDateString('fr-CA');
}

const createEmployee = (req, res) => {
  console.log(req.body);
  const em = {
    Username: req.body.Username,
    Psswrd: encrypt(req.body.Password),
    HireDate: createMySqlDate(new Date()),
  };
  console.log(em);
  /*
    Error looks like:
    {
      "code": "ER_BAD_FIELD_ERROR",
      "errno": 1054,
      "sqlMessage": "Unknown column 'Password' in 'field list'",
      "sqlState": "42S22",
      "index": 0,
      "sql": "INSERT INTO Employees SET EmployeeId = UUID_TO_BIN(UUID(), true), `Username` = 'Shikhar', `Password` = 'Sinha'"
    }
  */
  connection.query('INSERT INTO Employees SET EmployeeId = UUID_TO_BIN(UUID(), true), ?', em, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.json(err);
      return;
    }
    console.log('results:');
    console.log(results);
    console.log('fields:');
    console.log(fields);
    res.json(results);
  });
};

export default createEmployee;
