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
exports.DriverService = exports.rejectRequest = exports.createDriver = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = require("../../errorHalpers/AppError");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("./driver.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDriver = (payload, rider) => __awaiter(void 0, void 0, void 0, function* () {
    const data = Object.assign(Object.assign({}, payload), { user: rider });
    const driver = yield driver_model_1.Driver.create(data);
    yield user_model_1.User.findByIdAndUpdate(rider, { role: 'DRIVER' }, { new: true });
    return driver;
});
exports.createDriver = createDriver;
const rejectRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isDriverExist = yield user_model_1.User.findOne({ _id: payload.user });
    if (!isDriverExist || isDriverExist.role !== user_constant_1.Role.DRIVER) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'Driver does not exist');
    }
    if (isDriverExist.isBlocked) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, 'Driver is blocked');
    }
    const driver = yield driver_model_1.Driver.create(payload);
    return driver;
});
exports.rejectRequest = rejectRequest;
const updateDriverStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id);
    if (!driver) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, 'Driver not found');
    }
    const updatedDriver = yield driver_model_1.Driver.findByIdAndUpdate(id, { status: status }, { new: true });
    return updatedDriver;
});
const getDriverById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id);
    if (!driver) {
        throw new AppError_1.AppError(http_status_codes_1.default.NOT_FOUND, 'Driver not found');
    }
    return driver;
});
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield driver_model_1.Driver.find({});
    return drivers;
});
const approveDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id);
    if (!driver) {
        throw new AppError_1.AppError(404, 'Driver not found');
    }
    driver.approved = true;
    driver.suspended = false;
    yield driver.save();
    return driver;
});
const suspendDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(id);
    if (!driver) {
        throw new AppError_1.AppError(404, 'Driver not found');
    }
    driver.suspended = true;
    driver.isOnline = false;
    yield driver.save();
    return driver;
});
const getEarning = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, 'driver');
    const driver = yield driver_model_1.Driver.findOne({ user: id });
    if (!driver)
        throw new AppError_1.AppError(404, 'Driver not found');
    return driver;
});
const updateAvivility = (id, onlineStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDriver = yield driver_model_1.Driver.findOneAndUpdate({ user: id }, { isOnline: onlineStatus.online }, { new: true });
    if (!updatedDriver) {
        throw new AppError_1.AppError(404, "Driver not found");
    }
    return updatedDriver;
});
exports.DriverService = {
    createDriver: exports.createDriver,
    approveDriver,
    suspendDriver,
    updateDriverStatus,
    getDriverById,
    getAllDrivers,
    getEarning,
    updateAvivility
};
