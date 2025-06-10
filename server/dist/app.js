"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("./interfaces/routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./interfaces/routes/adminRoutes"));
const providerRoutes_1 = __importDefault(require("./interfaces/routes/providerRoutes"));
//for upload path
const url_1 = require("url");
const path_1 = require("path");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = (0, path_1.dirname)(__filename);
//for upload path
dotenv_1.default.config();
exports.app = (0, express_1.default)();
//  middlewares
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true, // Allow cookies (like JWT tokens) to be sent
}));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((req, res, next) => {
    next();
});
exports.app.use(body_parser_1.default.json());
// app.ts or index.ts
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//  routes
exports.app.use('/api', authRoutes_1.default);
exports.app.use('/api/admin', adminRoutes_1.default);
exports.app.use('/api/provider', providerRoutes_1.default);
//  exports.default  app
//# sourceMappingURL=app.js.map