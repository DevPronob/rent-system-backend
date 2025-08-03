"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(user_constant_1.Role), default: user_constant_1.Role.RIDER },
}, { timestamps: true });
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcryptjs_1.default.hashSync(this.password, 10);
    }
    next();
});
exports.User = (0, mongoose_1.model)('User', userSchema);
