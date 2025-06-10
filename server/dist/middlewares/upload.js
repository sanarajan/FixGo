"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// middleware/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, "public/uploads/providerServices/");
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); // e.g., 1673512351.jpg
    },
});
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=upload.js.map