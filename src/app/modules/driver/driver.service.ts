import { AppError } from '../../errorHalpers/AppError';
import { Role } from '../user/user.constant';
import { User } from '../user/user.model';
import { IDriver } from './driver.interface';
import { Driver } from './driver.model';
import httpStatus from 'http-status-codes';

export const createDriver = async (payload: IDriver, rider: string) => {
  const data = {
    ...payload,
    user: rider,
  };
  const driver = await Driver.create(data);
  await User.findByIdAndUpdate(rider, { role: 'DRIVER' }, { new: true });
  return driver;
};

export const rejectRequest = async (payload: IDriver) => {
  const isDriverExist = await User.findOne({ _id: payload.user });
  if (!isDriverExist || isDriverExist.role !== Role.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Driver does not exist');
  }
  if (isDriverExist.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'Driver is blocked');
  }
  const driver = await Driver.create(payload);
  return driver;
};

const updateDriverStatus = async (id: string, status: string) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    { status: status },
    { new: true },
  );
  return updatedDriver;
};

const getDriverById = async (id: string) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  return driver;
};

const getAllDrivers = async () => {
  const drivers = await Driver.find({});
  return drivers;
};
const approveDriver = async (id: string) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(404, 'Driver not found');
  }
  driver.approved = true;
  driver.suspended = false;
  await driver.save();
  return driver;
};
const suspendDriver = async (id: string) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(404, 'Driver not found');
  }
  driver.suspended = true;
  driver.isOnline = false;
  await driver.save();
  return driver;
};

const getEarning = async (id: string) => {
  console.log(id, 'driver');
  const driver = await Driver.findOne({ user: id });
  if (!driver) throw new AppError(404, 'Driver not found');

  return driver;
};
export const DriverService = {
  createDriver,
  approveDriver,
  suspendDriver,
  updateDriverStatus,
  getDriverById,
  getAllDrivers,
  getEarning,
};
