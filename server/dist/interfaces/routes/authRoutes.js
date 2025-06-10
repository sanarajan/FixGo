"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const router = express_1.default.Router();
router.post("/register", AuthController_1.register);
router.post("/login", AuthController_1.login);
router.post("/auth/refresh", AuthController_1.refreshToken);
router.post("/emailVerification", AuthController_1.emailVerification);
router.post("/validateOtp", AuthController_1.validateOtp);
router.post("/google", AuthController_1.googleLogin);
router.post("/forgotPassword", AuthController_1.forgotPassword);
router.post("/resetPassword", AuthController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map