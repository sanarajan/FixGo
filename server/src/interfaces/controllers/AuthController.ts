import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";

import { RegisterUser } from "../../application/use-cases/RegisterUser";

import { EmailVerifications } from "../../application/use-cases/EmailVerifications";
import { OtpService } from "../../application/services/OtpService";

import { User } from "../../domain/models/User";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { AuthService } from "../../application/services/AuthService";
import { LoginUser } from "../../application/use-cases/LoginUser";
import { RefreshTokenUseCase } from "../../application/use-cases/RefreshTokenUsecase";
import { GoogleLoginUseCase } from "../../application/use-cases/GoogleLoginUseCase";
import {ForgotPasswordUseCase} from "../../application/use-cases/ForgotPasswordUseCase"
import {ResetPassword} from "../../application/use-cases/ResetPassword";
import {FetchUserUsecase} from "../../application/use-cases/FetchUserUsecase"
interface CustomError extends Error {
  status?: number;
}

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData: User = req.body;
    const registerUser = container.resolve(RegisterUser);
    const user = await registerUser.execute(req.body);
    res.status(201).json({ user });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "Something went wrong" });
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, userType } = req.body;
    const loginUser = container.resolve(LoginUser);
    const { tokens, user } = await loginUser.execute(email, password, userType);
    let cookieName = `${userType}_refreshToken`;
// let accessTokName= `${userType}_accessToken`
    res.cookie(cookieName, tokens.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
console.log('"here i set refreshtoken 7 days expire')
    res.status(200).json({
      accessToken: tokens.accessToken,
      user,
    });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "Login failed" });
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userRole= req.body.userRole
    console.log(userRole+" role cjeck")
    const refreshToken = req.cookies[userRole+"_refreshToken"];

    if (!refreshToken) {    
      res.status(400).json({ message: "Refresh token missing" });
      return;
    }
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const { accessToken, role,id } = refreshTokenUseCase.execute(refreshToken);

    const userRepository = container.resolve<UserRepository>("UserRepository");
    const user = await userRepository.findByRoleAndId(id,role);

    if (!user) {
      res.status(404).json({ message: "user not exist" });
    }

    res.status(200).json({ accessToken, role });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 401)
      .json({ error: error.message || "Invalid refresh token" });
  }
};

const customerRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(" tokn reaches")

    const refreshToken = req.cookies["customer_refreshToken"];
    if (!refreshToken) {    
      res.status(400).json({ message: "Refresh token missing" });
      return;
    }
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const { accessToken, role,id } = refreshTokenUseCase.execute(refreshToken);

    const userRepository = container.resolve<UserRepository>("UserRepository");
    const user = await userRepository.findByRoleAndId(id,role);

    if (!user) {
      res.status(404).json({ message: "user not exist" });
    }

    res.status(200).json({ accessToken, role });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 401)
      .json({ error: error.message || "Invalid refresh token" });
  }
};
const emailVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, userType } = req.body;

    const verifyEmail = container.resolve(EmailVerifications);
    const otp = await verifyEmail.execute(email, userType);
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "verification failed" });
  }
};

const validateOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    let { otpEmail, userOtp, userType } = req.body;
    const email = otpEmail;
    const otpService = container.resolve<OtpService>("OtpService");

    const isValid = await otpService.validateOtp(email, userOtp);
    console.log(isValid + " valid");

    if (!isValid) {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
    const userRepository = container.resolve<UserRepository>("UserRepository");
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
    const authService = container.resolve<AuthService>("AuthService");
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
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message || "OTP validation failed" });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, userType } = req.body;

    // Validate and log in the user via Google
    const googleLoginUseCase = container.resolve(GoogleLoginUseCase);
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
  } catch (err) {
    const error = err as CustomError;
    console.log(error.message);
    res
      .status(error.status || 400)
      .json({ message: error.message || "Something went wrong" });
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {console.log("reached forgot")
    const { email, userType } = req.body;

    // Validate and log in the user via Google
    const googleLoginUseCase = container.resolve(ForgotPasswordUseCase);
    const  result  = await googleLoginUseCase.execute(email, userType);
   
    res.status(200).json({
      result,
      message:"A reset password link send to your email",
    });
  } catch (err) {
    const error = err as CustomError;
    console.log(error.message);
    res
      .status(error.status || 400)
      .json({ message: error.message || "Something went wrong" });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
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
    const resetPasswordUseCase = container.resolve(ResetPassword);
    const success = await resetPasswordUseCase.execute(password, token);

    if (success) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(500).json({ message: "Could not update password" });
    }
  } catch (err) {
    const error = err as Error;
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};


export const fetchUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userAdmin=(req as any).user
     const adminId = userAdmin.id
  
    const userData = container.resolve(FetchUserUsecase);
    const user = await userData.execute(adminId);

   
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: user });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
  
};
const customerLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {console.log(" reached logout")
     const admin = (req as any).user;
    const customerId =admin.id
    const role =admin.role
console.log(role +" role in logiut")
 res.cookie(`${role}_refreshToken`, "", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  expires: new Date(0), // force expire cookie
});
    res.status(200).json({ message: "Logged out",role });
  } catch (err) {
    const error = err as CustomError;
    res
      .status(error.status || 400)
      .json({ error: error.message || "verification failed" });
  }
};

export {
  register,
  login,
  customerLogout,
  refreshToken,
  customerRefreshToken,
  emailVerification,
  validateOtp,
  googleLogin,
  forgotPassword,
  resetPassword
};
