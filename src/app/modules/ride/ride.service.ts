/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../errorHalpers/AppError';
import { IRide } from './ride.interface';
import httpStatus from 'http-status-codes';
import { Ride } from './ride.model';
import { User } from '../user/user.model';
import { calculateDistance, calculateFare } from '../../utils/calculateFare';
import { Driver } from '../driver/driver.model';
import { Types } from 'mongoose';

const requestRide = async (payload: Partial<IRide>, rider: string) => {
  const isRiderExist = await User.findOne({ _id: rider, role: 'RIDER' });
  console.log(rider, payload);
  if (!isRiderExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Rider does not exist');
  }

  if (isRiderExist.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Driver or Rider is blocked');
  }
  if (!payload.destinationLocation?.lat || !payload.destinationLocation.lng) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'Please Insert Your Destination',
    );
  }
  if (!payload.pickupLocation?.lat || !payload.pickupLocation.lng) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'Please Insert Your Destination',
    );
  }

  const distance = calculateDistance(
    payload.pickupLocation?.lat,
    payload.pickupLocation.lng,
    payload.destinationLocation.lat,
    payload.destinationLocation.lng,
  );

  const estimatedFare = calculateFare(distance);
  console.log('Requesting ride with payload:', estimatedFare);
  const data = {
    ...payload,
    rider: rider,
    fare: estimatedFare,
  };
  const ride = await Ride.create(data);
  return ride;
};

const cancelRide = async (rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(404, 'Ride not found');

  if (ride.status !== 'requested') {
    throw new AppError(400, 'You can only cancel before acceptance');
  }

  const now = new Date();
  const diff =
    (now.getTime() - (ride.createdAt as any)!.getTime()) / (1000 * 60);
  if (diff > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cancel time window expired');
  }
  ride.status = 'cancelled';
  ride.canceledAt = new Date();
  await ride.save();
  return ride;
};

const updateRideStatus = async (rideId: string, newStatus: any) => {
  console.log(newStatus);
  const ride = await Ride.findById(rideId);
  if (!ride) throw new AppError(404, 'Ride not found');

  if (ride.status === 'completed') {
    throw new AppError(400, 'Ride is already completed');
  }

  ride.status = newStatus;
  //  "requested",
  //       "accepted",
  //       "picked_up",
  //       "in_transit",
  //       "completed",
  //       "cancelled",

  if (newStatus === 'picked_up') {
    ride.pickedUpAt = new Date();
  }

  if (newStatus === 'completed') {
    ride.completedAt = new Date();
    console.log(ride);

    if (ride.driver) {
      console.log(ride, 'ride');
      const driver = await Driver.findOne({ user: ride.driver });
      if (!driver) throw new AppError(404, 'Driver not found');

      driver.earnings += ride.fare || 0;
      await driver.save();
    }
  }

  await ride.save();
  return ride;
};

const getRideById = async (rideId: string) => {
  return Ride.findById(rideId).populate('rider').populate('driver');
};

const getRidesByUser = async (userId: string) => {
  return Ride.find({ rider: userId })
    .sort({ requestedAt: -1 })
    .populate('rider')
    .populate('driver');
};

const getRidesByDriver = async (driverId: string) => {
  return Ride.find({ driver: driverId })
    .sort({ requestedAt: -1 })
    .populate('rider')
    .populate('driver');
};

const getAllRides = async () => {
  return Ride.find()
    .sort({ requestedAt: -1 })
    .populate('rider')
    .populate('driver');
};

const acceptByDriver = async (rideId: string, driverId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
  }

  const driver =await Driver.findById(driverId)
  if(driver?.isOnline === false){
    throw new AppError(httpStatus.NOT_FOUND, 'Cant Assign  You Are Offline');
  }

    ride.status = 'accepted';
  ride.driver = new Types.ObjectId(driverId); 
  ride.requestedAt = new Date();

  await ride.save();
  return ride;
};

const completeRide = async (rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
  }

  ride.status = 'completed';
  ride.fare = ride.fare || 0;
  ride.completedAt = new Date();
  await ride.save();

  return ride;
};

const getRiderHistory = async (riderId: string) => {
  console.log(riderId);

  const riderHistory = await Ride.find({ rider: riderId });
  console.log(riderHistory);
  return riderHistory;
};

const getDriverHistory = async (driverId: string) => {
  return await Ride.find({ driver: driverId }).sort({ createdAt: -1 });
};
export const RideService = {
  requestRide,
  cancelRide,
  getRiderHistory,
  getDriverHistory,
  updateRideStatus,
  getRideById,
  getRidesByUser,
  getRidesByDriver,
  getAllRides,
  acceptByDriver,
  completeRide,
};
