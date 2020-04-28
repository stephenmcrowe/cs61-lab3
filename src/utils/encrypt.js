import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';

/*
 * Arguments:
 *   rawPassword (str) - password to check
 *   encrypted (str) - encrypted password from the db
 *   salt (str) - salt from the db
 *
 * Return (bool) - whether the passwords match
 */
export function comparePasswords(rawPassword, encrypted, salt) {
  const generated = bcrypt.hashSync(rawPassword, salt);
  return generated === encrypted;
}

/*
 * Given a uuid (str), return a JWT
 */
export function tokenForUser(uuid) {
  const timestamp = new Date().getTime();
  return jwt.encode({ uuid, iat: timestamp }, 'secret');
}

/*
 * Given a password (str), return an encrypted password
 * and it's corresponding salt.
 * Note: the object uses keys Psswrd and Salt because
 * those are the exact names of the columns in the db
 */
export function genSaltedPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const encrypted = bcrypt.hashSync(password, salt);
  return { Psswrd: encrypted, Salt: salt };
}
