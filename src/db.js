import mysql from 'mysql';
import config from './config';

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.schema,
});

connection.connect((err) => {
  if (err) throw err;
});

export default connection;
