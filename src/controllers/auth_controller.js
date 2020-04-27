import { tokenForUser } from '../utils/encrypt';

export const signin = (req, res) => {
  console.log('in signin');
  console.log(Object.keys(req.user));
  if (req.user.error) 
  {
    res.send({
      status: 200,
      error: 'invalid user/password',
    });
  }
  else
  {
    res.send({
      status: 200,
      error: null,
      response: {
        EmployeeId: req.user.EmployeeId,
        IsAdmin: req.user.IsAdmin,
        token: tokenForUser(req.user.EmployeeId),
      },
    });
  }
};

export const signup = (req, res) => {
  res.send({ status: 200, error: null, response: 'not built yet' });
};
