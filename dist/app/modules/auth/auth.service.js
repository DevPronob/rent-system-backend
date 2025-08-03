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
exports.AuthServices = void 0;
const AppError_1 = require("../../errorHalpers/AppError");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const config_1 = require("../../config");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'User already exists with this email');
    }
    const user = yield user_model_1.User.create(payload);
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
    };
    const accessToken = (0, jwt_1.generateToken)(userData, config_1.envConfig.JWT_SECRET);
    const refreshToken = (0, jwt_1.generateToken)(userData, config_1.envConfig.JWT_SECRET);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isPasswordMatch) {
        throw new AppError_1.AppError(http_status_codes_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    if (isUserExist.isBlocked) {
        throw new AppError_1.AppError(http_status_codes_1.default.FORBIDDEN, 'You are blocked by admin');
    }
    const userData = {
        _id: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role,
        isBlocked: isUserExist.isBlocked,
    };
    const accessToken = (0, jwt_1.generateToken)(userData, config_1.envConfig.JWT_SECRET);
    const refreshToken = (0, jwt_1.generateToken)(userData, config_1.envConfig.JWT_SECRET);
    return {
        accessToken,
        refreshToken,
    };
});
exports.AuthServices = {
    registerUser,
    loginUser,
};
