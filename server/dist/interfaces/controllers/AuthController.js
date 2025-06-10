"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.googleLogin = exports.validateOtp = exports.emailVerification = exports.refreshToken = exports.login = exports.register = void 0;
const tsyringe_1 = require("tsyringe");
const RegisterUser_1 = require("../../application/use-cases/RegisterUser");
const EmailVerifications_1 = require("../../application/use-cases/EmailVerifications");
const LoginUser_1 = require("../../application/use-cases/LoginUser");
const RefreshTokenUsecase_1 = require("../../application/use-cases/RefreshTokenUsecase");
const GoogleLoginUseCase_1 = require("../../application/use-cases/GoogleLoginUseCase");
const ForgotPasswordUseCase_1 = require("../../application/use-cases/ForgotPasswordUseCase");
const ResetPassword_1 = require("../../application/use-cases/ResetPassword");
const register = async (req, res, next) => {
    try {
        const userData = req.body;
        const registerUser = tsyringe_1.container.resolve(RegisterUser_1.RegisterUser);
        const user = await registerUser.execute(req.body);
        res.status(201).json({ user });
    }
    catch (err) {
        const error = err;
        res
            .status(error.status || 400)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password, userType } = req.body;
        const loginUser = tsyringe_1.container.resolve(LoginUser_1.LoginUser);
        const { tokens, user } = await loginUser.execute(email, password, userType);
        let cookieName = `${userType}_refreshToken`;
        // let accessTokName= `${userType}_accessToken`
        res.cookie(cookieName, tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            accessToken: tokens.accessToken,
            user,
        });
    }
    catch (err) {
        const error = err;
        res
            .status(error.status || 400)
            .json({ error: error.message || "Login failed" });
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const userRole = req.body.userRole;
        const refreshToken = req.cookies[userRole + "_refreshToken"];
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token missing" });
            return;
        }
        const refreshTokenUseCase = tsyringe_1.container.resolve(RefreshTokenUsecase_1.RefreshTokenUseCase);
        const { accessToken, role, id } = refreshTokenUseCase.execute(refreshToken);
        const userRepository = tsyringe_1.container.resolve("UserRepository");
        const user = await userRepository.findByRoleAndId(id, role);
        if (!user) {
            res.status(404).json({ message: "user not exist" });
        }
        res.status(200).json({ accessToken, role });
    }
    catch (err) {
        const error = err;
        res
            .status(error.status || 401)
            .json({ error: error.message || "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
const emailVerification = async (req, res, next) => {
    try {
        const { email, userType } = req.body;
        const verifyEmail = tsyringe_1.container.resolve(EmailVerifications_1.EmailVerifications);
        const otp = await verifyEmail.execute(email, userType);
        res.status(200).json({ message: "OTP sent successfully", otp });
    }
    catch (err) {
        const error = err;
        res
            .status(error.status || 400)
            .json({ error: error.message || "verification failed" });
    }
};
exports.emailVerification = emailVerification;
const validateOtp = async (req, res) => {
    try {
        let { otpEmail, userOtp, userType } = req.body;
        const email = otpEmail;
        const otpService = tsyringe_1.container.resolve("OtpService");
        const isValid = await otpService.validateOtp(email, userOtp);
        console.log(isValid + " valid");
        if (!isValid) {
            res.status(400).json({ error: "Invalid or expired OTP" });
        }
        const userRepository = tsyringe_1.container.resolve("UserRepository");
        let user = await userRepository.findByEmail(email);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const formattedUser = {
            ...user,
            _id: user._id?.toString(),
            providerId: user.providerId?.toString() ?? undefined,
        };
        // Generate tokens
        const authService = tsyringe_1.container.resolve("AuthService");
        const tokens = authService.generateTokens(user);
        const cookieName = `${userType}_refreshToken`;
        res.cookie(cookieName, tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            message: "OTP validated successfully",
            accessToken: tokens.accessToken,
            user: formattedUser,
            isValid,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message || "OTP validation failed" });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
};
exports.validateOtp = validateOtp;
const googleLogin = async (req, res) => {
    try {
        const { token, userType } = req.body;
        // Validate and log in the user via Google
        const googleLoginUseCase = tsyringe_1.container.resolve(GoogleLoginUseCase_1.GoogleLoginUseCase);
        const { tokens, user } = await googleLoginUseCase.execute(token, userType);
        let cookieName = `${userType}_refreshToken`;
        res.cookie(cookieName, tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            accessToken: tokens.accessToken,
            user,
        });
    }
    catch (err) {
        const error = err;
        console.log(error.message);
        res
            .status(error.status || 400)
            .json({ message: error.message || "Something went wrong" });
    }
};
exports.googleLogin = googleLogin;
// const googleCallback = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { token, userType } = req.body;
//     // Call the GoogleLoginUseCase to process the login
//     const googleLoginUseCase = container.resolve(GoogleLoginUseCase);
//     const { accessToken, user } = await googleLoginUseCase.execute(token, userType);
//     // Set the refresh token cookie (optional)
//     const cookieName = `${userType}_refreshToken`;
//     res.cookie(cookieName, accessToken, {
//       httpOnly: true,
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });
//     // Respond with the access token and user data
//     res.status(200).json({
//       accessToken,
//       user,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       error: err instanceof Error ? err.message : 'Google login failed',
//     });
//   }
// };
const forgotPassword = async (req, res) => {
    try {
        console.log("reached forgot");
        const { email, userType } = req.body;
        // Validate and log in the user via Google
        const googleLoginUseCase = tsyringe_1.container.resolve(ForgotPasswordUseCase_1.ForgotPasswordUseCase);
        const result = await googleLoginUseCase.execute(email, userType);
        res.status(200).json({
            result,
            message: "A reset password link send to your email",
        });
    }
    catch (err) {
        const error = err;
        console.log(error.message);
        res
            .status(error.status || 400)
            .json({ message: error.message || "Something went wrong" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;
        if (!password || password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }
        if (!token) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const resetPasswordUseCase = tsyringe_1.container.resolve(ResetPassword_1.ResetPassword);
        const success = await resetPasswordUseCase.execute(password, token);
        if (success) {
            res.status(200).json({ message: "Password updated successfully" });
        }
        else {
            res.status(500).json({ message: "Could not update password" });
        }
    }
    catch (err) {
        const error = err;
        console.error("Reset Password Error:", error.message);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=AuthController.js.map