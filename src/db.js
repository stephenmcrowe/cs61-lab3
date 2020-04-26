import mysql from 'mysql';
import config from './config';

// Promisify the mysql connection
// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b

class Database {
  constructor(cnfg) {
    this.connection = mysql.createConnection(cnfg);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) { return reject(err); }
        return resolve(rows);
      });
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) { return reject(err); }
        return resolve();
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) { return reject(err); }
        return resolve();
      });
    });
  }
}

const cnfg = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.schema,
  dateStrings: 'date',
};

const db = new Database(cnfg);
// Test connection
db.connect().catch((err) => { throw err; });

export default db;
