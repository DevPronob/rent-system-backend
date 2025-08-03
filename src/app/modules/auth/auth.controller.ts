import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { setAuthCookie } from '../../utils/setCookie';

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthServices.registerUser(req.body);
  if (user) {
    setAuthCookie(res, user);
  }
  sendResponse(res, {
    success: true,
    message: 'User registered successfully',
    statusCode: 201,
    data: user,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await AuthServices.loginUser(email, password);
  if (user) {
    setAuthCookie(res, user);
  }
  sendResponse(res, {
    success: true,
    message: 'User logged in successfully',
    statusCode: 200,
    data: user,
  });
});
export const AuthControllers = {
  registerUser,
  loginUser,
};
