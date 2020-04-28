/* eslint-disable consistent-return */
// lets import some stuff
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { comparePasswords } from './encrypt';
import db from '../db';

// options for local strategy, we'll use username (found in POST body)
const localOptions = { usernameField: 'username' };

// options for jwt strategy
// we'll pass in the jwt in an `Authorization` header prefixed with JWT
// so passport can find it there
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: 'secret',
};
// NOTE: we are not using a bearer token, disregard information about bearer tokens on the internet.

// username + password authentication strategy
const GET_PASSWORD = `
SELECT BIN_TO_UUID(EmployeeId, true) as EmployeeId, Psswrd, IsAdmin, Salt
FROM Employees 
WHERE Username = ?`;
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  db.query(GET_PASSWORD, username)
    .then((results) => {
      if (Array.isArray(results) && results.length) {
        const encryptedPassword = results[0].Psswrd.toString();
        const salt = results[0].Salt.toString();
        if (comparePasswords(password, encryptedPassword, salt)) {
          // Send the object to the req through req.user
          done(null, results[0]);
        } else {
          // Password didn't match username here
          done(null, { status: 401, error: 'Invalid username or password' });
        }
      } else {
        // Array came back empty so no user found
        done(null, { status: 401, error: 'Username not found' });
      }
    })
    .catch((err) => {
      console.log(err);
      // MYSQL error
      done(err, false);
    });
});

const CHECK_IF_EXISTS = `
SELECT BIN_TO_UUID(EmployeeId, true) as EmployeeId, IsAdmin
FROM Employees 
WHERE EmployeeId = UUID_TO_BIN(?, true)`;
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // JWT passed checks. Just need to see if the user ID
  // in the payload exists in our database
  db.query(CHECK_IF_EXISTS, payload.uuid)
    .then((results) => {
      if (Array.isArray(results) && results.length) {
        done(null, results[0]);
      } else {
        done(null, false);
      }
    })
    .catch((err) => {
      console.log(err);
      done(err, false);
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);


export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });
