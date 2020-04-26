import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';

export function comparePasswords(rawPassword, encrypted, salt) {
  const generated = bcrypt.hashSync(rawPassword, salt);
  console.log(generated);
  console.log(encrypted);
  return generated === encrypted;
}

export function tokenForUser(uuid) {
  const timestamp = new Date().getTime();
  return jwt.encode({ uuid, iat: timestamp }, 'secret');
}

export function genSaltedPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const encrypted = bcrypt.hashSync(password, salt);
  return { Psswrd: encrypted, Salt: salt };
}
