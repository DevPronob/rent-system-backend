import { AppError } from '../../errorHalpers/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status-codes';

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};
const getAllUsers = async () => {
  const users = await User.find({});
  return users;
};

const updateUser = async (id: string, payload: IUser) => {
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return user;
};
const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return null;
};

const blockUser = async (userId: string) => {
  const blockedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true },
  );
  return blockedUser;
};

const unBlockUser = async (userId: string) => {
  const blockedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true },
  );
  return blockedUser;
};

export const UserServices = {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser,
};
