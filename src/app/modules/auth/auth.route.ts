import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthControllers } from './auth.controller';

const router = Router();
router.post(
  '/register',
  validateRequest(UserValidation.createUserSchemaValidation),
  AuthControllers.registerUser,
);
router.post(
  '/login',
  validateRequest(UserValidation.loginSchemaValidation),
  AuthControllers.loginUser,
);
export const AuthRoutes = router;
