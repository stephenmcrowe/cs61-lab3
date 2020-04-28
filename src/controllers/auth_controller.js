import { tokenForUser } from '../utils/encrypt';

/*
 * Signin route. Most of the work is done in passport.js.
 * Provide the username and password through POST body
 * return - a JWT token, the logged in user's uuid, and
 *          whether they are an admin
*/
const signin = (req, res) => {
  // Handle error to give more information back to the user
  if (req.user.error) {
    res.status(req.user.status).send({
      error: req.user.error,
      response: null,
    });
  } else {
    res.status(200).send({
      error: null,
      response: {
        EmployeeId: req.user.EmployeeId,
        IsAdmin: req.user.IsAdmin,
        token: tokenForUser(req.user.EmployeeId),
      },
    });
  }
};

export default signin;
