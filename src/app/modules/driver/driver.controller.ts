import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { DriverService } from './driver.service';

const createDriver = catchAsync(async (req, res) => {
  const rider = req.user;
  console.log(rider);
  const driver = await DriverService.createDriver(req.body, rider._id);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Driver Created Successfully',
    data: driver,
  });
});
const getDriverById = catchAsync(async (req, res) => {
  const driver = await DriverService.getDriverById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver Rectrive Successfully',
    data: driver,
  });
});

const getAllDrivers = catchAsync(async (req, res) => {
  const drivers = await DriverService.getAllDrivers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver Rectrived Successfully',
    data: drivers,
  });
});

const updateDriverStatus = catchAsync(async (req, res) => {
  const updatedDriver = await DriverService.updateDriverStatus(
    req.params.id,
    req.body.status,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver status updated successfully',
    data: updatedDriver,
  });
});

const approveDriver = catchAsync(async (req, res) => {
  const result = await DriverService.approveDriver(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver approved successfully',
    data: result,
  });
});

const suspendDriver = catchAsync(async (req, res) => {
  const result = await DriverService.suspendDriver(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver suspended successfully',
    data: result,
  });
});

const getEarinings = catchAsync(async (req, res) => {
  const user = req.user;
  console.log(user);
  const driver = await DriverService.getEarning(user._id.toString());
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Driver Earning Rectrive Successfully',
    data: driver.earnings,
  });
});

const updateAvailablity = catchAsync(async (req, res) => {
    const userId =req.user._id
    console.log(userId,req.body,"body")
  const result = await DriverService.updateAvivility(userId,req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver online status changed',
    data: result,
  });
});

export const DriverControllers = {
  createDriver,
  getDriverById,
  getAllDrivers,
  updateDriverStatus,
  approveDriver,
  suspendDriver,
  getEarinings,
  updateAvailablity
};
