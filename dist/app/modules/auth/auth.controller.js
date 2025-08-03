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
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const setCookie_1 = require("../../utils/setCookie");
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.AuthServices.registerUser(req.body);
    if (user) {
        (0, setCookie_1.setAuthCookie)(res, user);
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'User registered successfully',
        statusCode: 201,
        data: user,
    });
}));
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield auth_service_1.AuthServices.loginUser(email, password);
    if (user) {
        (0, setCookie_1.setAuthCookie)(res, user);
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'User logged in successfully',
        statusCode: 200,
        data: user,
    });
}));
exports.AuthControllers = {
    registerUser,
    loginUser,
};
