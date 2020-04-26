import { tokenForUser } from '../utils/encrypt';

export const signin = (req, res) => {
  console.log('in signin');
  console.log(Object.keys(req.user));
  res.send({
    status: 200,
    error: null,
    response: tokenForUser(req.user.EmployeeId),
  });
};

export const signup = (req, res) => {
  res.send({ status: 200, error: null, response: 'not built yet' });
};
