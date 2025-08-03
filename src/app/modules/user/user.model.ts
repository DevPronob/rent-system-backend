import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcryptjs';
import { Role } from './user.constant';
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.RIDER },
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

export const User = model<IUser>('User', userSchema);
