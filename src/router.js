import { Router } from 'express';
import * as Employees from './controllers/employee_controller';
import * as Auth from './controllers/auth_controller';
import { requireAuth, requireSignin } from './utils/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our Lab3 api' });
});

router.post('/signin', requireSignin, Auth.signin);

router.route('/employees')
  .get(requireAuth, Employees.getEmployees)
  .post(Employees.createEmployee);

router.route('/employees/:id')
  .get(Employees.getEmployee)
  .put(requireAuth, Employees.updateEmployee)
  .delete(requireAuth, Employees.deleteEmployee);

export default router;
