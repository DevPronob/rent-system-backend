import { Schema, model, Types } from 'mongoose';

const driverSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    vehicleInfo: {
      type: String,
      required: true,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Driver = model('Driver', driverSchema);
