import { Role } from './user.constant';
export type RoleType = (typeof Role)[keyof typeof Role];
export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  isBlocked: boolean;
  role?: RoleType;
  status: 'pending' | 'approved' | 'suspended';
  createdAt?: Date;
  updatedAt?: Date;
}
