import { AppError } from '../../errorHalpers/AppError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import httpStatus from 'http-status-codes';

import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import { envConfig } from '../../config';

const registerUser = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exists with this email',
    );
  }
  const user = await User.create(payload);
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
  };
  const accessToken = generateToken(userData, envConfig.JWT_SECRET as string);

  const refreshToken = generateToken(userData, envConfig.JWT_SECRET as string);
  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (email: string, password: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }
  const isPasswordMatch = await bcrypt.compare(password, isUserExist.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }
  if (isUserExist.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are blocked by admin');
  }
  const userData = {
    _id: isUserExist._id,
    name: isUserExist.name,
    email: isUserExist.email,
    role: isUserExist.role,
    isBlocked: isUserExist.isBlocked,
  };
  const accessToken = generateToken(userData, envConfig.JWT_SECRET as string);

  const refreshToken = generateToken(userData, envConfig.JWT_SECRET as string);
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
};
