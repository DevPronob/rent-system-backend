import { Router } from 'express';
import { UserControllers } from './user.controller';
import { auth } from '../../middlewares/auth';
import { Role } from './user.constant';

const router = Router();

router.get('/', auth([Role.ADMIN]), UserControllers.getAllUsers);
router.get('/:id', auth([Role.ADMIN, Role.RIDER]), UserControllers.getUserById);

router.patch('/unblock/:id', auth([Role.ADMIN]), UserControllers.unBlockUser);
router.patch('/block/:id', auth([Role.ADMIN]), UserControllers.blockUser);

export const UserRoutes = router;
