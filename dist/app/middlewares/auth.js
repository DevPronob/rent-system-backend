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
exports.auth = void 0;
const AppError_1 = require("../errorHalpers/AppError");
const jwt_1 = require("../utils/jwt");
const config_1 = require("../config");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth = (authRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError_1.AppError(404, 'You dont have token to access this route');
            }
            const verifiedToken = (0, jwt_1.verifyToken)(token, config_1.envConfig.JWT_SECRET);
            if (!(verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.email)) {
                throw new AppError_1.AppError(401, 'Token is invalid or missing email');
            }
            if (verifiedToken.isBlocked) {
                throw new AppError_1.AppError(500, 'User Is Blocked');
            }
            const isUserExists = yield user_model_1.User.findOne({ email: verifiedToken.email });
            if (!isUserExists) {
                throw new AppError_1.AppError(404, 'Usr Not Exists');
            }
            console.log(isUserExists);
            if (isUserExists.isBlocked) {
                return res.status(403).json({
                    status: 'error',
                    message: 'User is blocked',
                });
            }
            if (!authRoles.includes(isUserExists.role)) {
                throw new AppError_1.AppError(http_status_codes_1.default.BAD_GATEWAY, 'You are not allowed to access this route');
            }
            console.log(isUserExists);
            req.user = isUserExists;
            console.log(req.user, 'req.user');
            next();
        }
        catch (error) {
            console.log('jwt error', error);
            next(error);
        }
    });
};
exports.auth = auth;
