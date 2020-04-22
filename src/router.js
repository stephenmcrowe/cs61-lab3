import { Router } from 'express';
import * as Employees from './controllers/employee_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our Lab3 api' });
});

router.route('/employees')
  .get(Employees.getEmployees)
  .post(Employees.createEmployee);

export default router;
