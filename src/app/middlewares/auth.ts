import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errorHalpers/AppError';
import { verifyToken } from '../utils/jwt';
import { envConfig } from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';
import httpStatus from 'http-status-codes';

export const auth = (authRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(404, 'You dont have token to access this route');
      }
      const verifiedToken = verifyToken(
        token,
        envConfig.JWT_SECRET,
      ) as JwtPayload;
      if (!verifiedToken?.email) {
        throw new AppError(401, 'Token is invalid or missing email');
      }
      const isUserExists = await User.findOne({ email: verifiedToken.email });
      if (!isUserExists) {
        throw new AppError(404, 'Usr Not Exists');
      }
      console.log(isUserExists);
      if (isUserExists.isBlocked) {
        return res.status(403).json({
          status: 'error',
          message: 'User is blocked',
        });
      }

      if (!authRoles.includes(isUserExists.role as unknown as string)) {
        throw new AppError(
          httpStatus.BAD_GATEWAY,
          'You are not allowed to access this route',
        );
      }
      console.log(isUserExists);
      req.user = isUserExists;
      console.log(req.user, 'req.user');
      next();
    } catch (error) {
      console.log('jwt error', error);
      next(error);
    }
  };
};
