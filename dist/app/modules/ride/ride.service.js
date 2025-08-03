"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = require("../../errorHalpers/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ride_model_1 = require("./ride.model");
const user_model_1 = require("../user/user.model");
const calculateFare_1 = require("../../utils/calculateFare");
const driver_model_1 = require("../driver/driver.model");
const mongoose_1 = require("mongoose");
const requestRide = (payload, rider) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const isRiderExist = yield user_model_1.User.findOne({ _id: rider, role: 'RIDER' });
    console.log(rider, payload);
    if (!isRiderExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'Rider does not exist');
    }
    if (isRiderExist.isBlocked) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, 'Driver or Rider is blocked');
    }
    if (!((_a = payload.destinationLocation) === null || _a === void 0 ? void 0 : _a.lat) || !payload.destinationLocation.lng) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_GATEWAY, 'Please Insert Your Destination');
    }
    if (!((_b = payload.pickupLocation) === null || _b === void 0 ? void 0 : _b.lat) || !payload.pickupLocation.lng) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_GATEWAY, 'Please Insert Your Destination');
    }
    const distance = (0, calculateFare_1.calculateDistance)((_c = payload.pickupLocation) === null || _c === void 0 ? void 0 : _c.lat, payload.pickupLocation.lng, payload.destinationLocation.lat, payload.destinationLocation.lng);
    const estimatedFare = (0, calculateFare_1.calculateFare)(distance);
    console.log('Requesting ride with payload:', estimatedFare);
    const data = Object.assign(Object.assign({}, payload), { rider: rider, fare: estimatedFare });
    const ride = yield ride_model_1.Ride.create(data);
    return ride;
});
const cancelRide = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppError_1.AppError(404, 'Ride not found');
    if (ride.status !== 'requested') {
        throw new AppError_1.AppError(400, 'You can only cancel before acceptance');
    }
    const now = new Date();
    const diff = (now.getTime() - ride.createdAt.getTime()) / (1000 * 60);
    if (diff > 5) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'Cancel time window expired');
    }
    ride.status = 'cancelled';
    ride.canceledAt = new Date();
    yield ride.save();
    return ride;
});
const updateRideStatus = (rideId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(newStatus);
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride)
        throw new AppError_1.AppError(404, 'Ride not found');
    if (ride.status === 'completed') {
        throw new AppError_1.AppError(400, 'Ride is already completed');
    }
    ride.status = newStatus;
    //  "requested",
    //       "accepted",
    //       "picked_up",
    //       "in_transit",
    //       "completed",
    //       "cancelled",
    if (newStatus === 'picked_up') {
        ride.pickedUpAt = new Date();
    }
    if (newStatus === 'completed') {
        ride.completedAt = new Date();
        console.log(ride);
        if (ride.driver) {
            console.log(ride, 'ride');
            const driver = yield driver_model_1.Driver.findOne({ user: ride.driver });
            if (!driver)
                throw new AppError_1.AppError(404, 'Driver not found');
            driver.earnings += ride.fare || 0;
            yield driver.save();
        }
    }
    yield ride.save();
    return ride;
});
const getRideById = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    return ride_model_1.Ride.findById(rideId).populate('rider').populate('driver');
});
const getRidesByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return ride_model_1.Ride.find({ rider: userId })
        .sort({ requestedAt: -1 })
        .populate('rider')
        .populate('driver');
});
const getRidesByDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    return ride_model_1.Ride.find({ driver: driverId })
        .sort({ requestedAt: -1 })
        .populate('rider')
        .populate('driver');
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    return ride_model_1.Ride.find()
        .sort({ requestedAt: -1 })
        .populate('rider')
        .populate('driver');
});
const acceptByDriver = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, 'Ride not found');
    }
    ride.status = 'accepted';
    ride.driver = new mongoose_1.Types.ObjectId(driverId); // ✅ convert string to ObjectId
    ride.requestedAt = new Date();
    yield ride.save();
    return ride;
});
const completeRide = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, 'Ride not found');
    }
    ride.status = 'completed';
    ride.fare = ride.fare || 0;
    ride.completedAt = new Date();
    yield ride.save();
    return ride;
});
const getRiderHistory = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(riderId);
    const riderHistory = yield ride_model_1.Ride.find({ rider: riderId });
    console.log(riderHistory);
    return riderHistory;
});
const getDriverHistory = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find({ driver: driverId }).sort({ createdAt: -1 });
});
exports.RideService = {
    requestRide,
    cancelRide,
    getRiderHistory,
    getDriverHistory,
    updateRideStatus,
    getRideById,
    getRidesByUser,
    getRidesByDriver,
    getAllRides,
    acceptByDriver,
    completeRide,
};
