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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ride_service_1 = require("./ride.service");
const requestRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Request body:', req.body);
    const rider = req.user._id;
    console.log(rider, 'rider id');
    const ride = yield ride_service_1.RideService.requestRide(req.body, rider);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Ride requested successfully',
        statusCode: 201,
        data: ride,
    });
}));
const cancleRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user._id;
    console.log(riderId);
    const result = yield ride_service_1.RideService.cancelRide(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Ride cancle successfully',
        statusCode: 200,
        data: result,
    });
}));
const getRideById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_service_1.RideService.getRideById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Ride retrieved successfully',
        statusCode: 200,
        data: ride,
    });
}));
const updateRideStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, req.params.id, 'req');
    const updatedRide = yield ride_service_1.RideService.updateRideStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Ride status updated successfully',
        statusCode: 200,
        data: updatedRide,
    });
}));
const getRidesByUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_service_1.RideService.getRidesByUser(req.params.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Rides retrieved successfully',
        statusCode: 200,
        data: rides,
    });
}));
const getRidesByDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_service_1.RideService.getRidesByDriver(req.params.driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Rides retrieved successfully',
        statusCode: 200,
        data: rides,
    });
}));
const getAllRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_service_1.RideService.getAllRides();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'All rides retrieved successfully',
        statusCode: 200,
        data: rides,
    });
}));
const acceptByDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id: rideId } = req.params;
    const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // ✅ get logged-in driver's id from token
    const ride = yield ride_service_1.RideService.acceptByDriver(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Ride assigned to driver successfully',
        statusCode: 200,
        data: ride,
    });
}));
const completeRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_service_1.RideService.completeRide(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Ride completed successfully',
        statusCode: 200,
        data: ride,
    });
}));
const getRiderHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user._id;
    console.log(riderId);
    const rides = yield ride_service_1.RideService.getRiderHistory(riderId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Rider history successfully',
        statusCode: 200,
        data: rides,
    });
}));
const getDriverHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user._id;
    const rides = yield ride_service_1.RideService.getDriverHistory(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Driver history successfully',
        statusCode: 200,
        data: rides,
    });
}));
exports.RideControllers = {
    requestRide,
    cancleRide,
    getRiderHistory,
    getDriverHistory,
    getRideById,
    updateRideStatus,
    getRidesByUser,
    getRidesByDriver,
    getAllRides,
    acceptByDriver,
    completeRide,
};
