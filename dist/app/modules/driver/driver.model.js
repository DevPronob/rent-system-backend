"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
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
}, {
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)('Driver', driverSchema);
