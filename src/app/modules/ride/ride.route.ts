import { Router } from 'express';
import { RideControllers } from './ride.controller';
import { auth } from '../../middlewares/auth';
import { Role } from '../user/user.constant';

const router = Router();

router.post('/request', auth([Role.RIDER]), RideControllers.requestRide);
router.patch('/:id/cancle', auth([Role.RIDER]), RideControllers.cancleRide);
router.get(
  '/history/rider',
  auth([Role.RIDER]),
  RideControllers.getRiderHistory,
);
router.get(
  '/history/driver',
  auth([Role.DRIVER]),
  RideControllers.getDriverHistory,
);

router.post('/:id/accept', auth([Role.DRIVER]), RideControllers.acceptByDriver);
router.patch(
  '/:id/status',
  auth([Role.DRIVER]),
  RideControllers.updateRideStatus,
);
router.patch('/:id/complete', RideControllers.completeRide);

export const RideRoutes = router;
