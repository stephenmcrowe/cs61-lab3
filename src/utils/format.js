import mysql from 'mysql';

/*
 * Creates SQL for handling a date
*/
export function createSQLForDateParsing(date) {
  const iso = date.toISOString();
  return mysql.raw(`STR_TO_DATE('${iso}', '%Y-%m-%dT%T.%fZ')`);
}

/*
 * Creates a MYSQL-readable date string. %Y-%m-%d. Ignores timezone
*/
export function createMySqlDate(date) {
  const iso = date.toISOString();
  return iso.slice(0, 10);
}
