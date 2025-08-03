import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { RideService } from './ride.service';

const requestRide = catchAsync(async (req: Request, res: Response) => {
  console.log('Request body:', req.body);
  const rider = req.user._id;
  console.log(rider, 'rider id');
  const ride = await RideService.requestRide(req.body, rider);
  sendResponse(res, {
    success: true,
    message: 'Ride requested successfully',
    statusCode: 201,
    data: ride,
  });
});

const cancleRide = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user._id;
  console.log(riderId);
  const result = await RideService.cancelRide(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'Ride cancle successfully',
    statusCode: 200,
    data: result,
  });
});
const getRideById = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.getRideById(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'Ride retrieved successfully',
    statusCode: 200,
    data: ride,
  });
});
const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body, req.params.id, 'req');
  const updatedRide = await RideService.updateRideStatus(
    req.params.id,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    message: 'Ride status updated successfully',
    statusCode: 200,
    data: updatedRide,
  });
});

const getRidesByUser = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getRidesByUser(req.params.userId);
  sendResponse(res, {
    success: true,
    message: 'Rides retrieved successfully',
    statusCode: 200,
    data: rides,
  });
});

const getRidesByDriver = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getRidesByDriver(req.params.driverId);
  sendResponse(res, {
    success: true,
    message: 'Rides retrieved successfully',
    statusCode: 200,
    data: rides,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const rides = await RideService.getAllRides();
  sendResponse(res, {
    success: true,
    message: 'All rides retrieved successfully',
    statusCode: 200,
    data: rides,
  });
});

const acceptByDriver = catchAsync(async (req: Request, res: Response) => {
  const { id: rideId } = req.params;
  const driverId = req.user?._id; // ✅ get logged-in driver's id from token

  const ride = await RideService.acceptByDriver(rideId, driverId);

  sendResponse(res, {
    success: true,
    message: 'Ride assigned to driver successfully',
    statusCode: 200,
    data: ride,
  });
});
const completeRide = catchAsync(async (req: Request, res: Response) => {
  const ride = await RideService.completeRide(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'Ride completed successfully',
    statusCode: 200,
    data: ride,
  });
});

const getRiderHistory = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user._id;
  console.log(riderId);
  const rides = await RideService.getRiderHistory(riderId);
  sendResponse(res, {
    success: true,
    message: 'Rider history successfully',
    statusCode: 200,
    data: rides,
  });
});

const getDriverHistory = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user._id;
  const rides = await RideService.getDriverHistory(driverId);
  sendResponse(res, {
    success: true,
    message: 'Driver history successfully',
    statusCode: 200,
    data: rides,
  });
});
export const RideControllers = {
  requestRide,
  cancleRide,
  getRiderHistory,
  getDriverHistory,
  getRideById,
  updateRideStatus,
  getRidesByUser,
  getRidesByDriver,
  getAllRides,
  acceptByDriver,
  completeRide,
};
