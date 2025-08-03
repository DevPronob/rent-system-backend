import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { UserServices } from './user.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status-codes';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserServices.getAllUsers();
  sendResponse(res, {
    success: true,
    message: 'Users rectrive successfully',
    statusCode: 200,
    data: users,
  });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getUserById(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'User Rectrive successfully',
    statusCode: 200,
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.updateUser(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    message: 'User updated successfully',
    statusCode: 200,
    data: user,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await UserServices.deleteUser(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'User deleted successfully',
    statusCode: 200,
    data: null,
  });
});
const blockUser = catchAsync(async (req: Request, res: Response) => {
  const blocked = await UserServices.blockUser(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'User blocked successfully',
    statusCode: httpStatus.OK,
    data: blocked,
  });
});

const unBlockUser = catchAsync(async (req: Request, res: Response) => {
  const unblocked = await UserServices.unBlockUser(req.params.id);
  sendResponse(res, {
    success: true,
    message: 'User unblocked successfully',
    statusCode: httpStatus.OK,
    data: unblocked,
  });
});

export const UserControllers = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
};
