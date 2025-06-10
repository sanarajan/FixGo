"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log(' MongoDB connected');
    }
    catch (err) {
        const error = err; //  Type assertion here
        console.error(' DB Error:', error.message);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map