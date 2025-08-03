import { Types } from 'mongoose';

export interface IDriver {
  _id: string;
  user?: Types.ObjectId;
  isOnline: boolean;
  vehicleInfo: string;
  earnings: number;
  approved: boolean;
  suspended: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
