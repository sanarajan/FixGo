import express from "express";
import { customerAuthProtect } from "../../middlewares/customerMiddleware";
import { upload } from "../../middlewares/upload";

import {
  register,
  login,
  refreshToken, 
  customerRefreshToken,
  adminRefreshToken, 
  emailVerification,
  validateOtp,
  googleLogin,
  forgotPassword,
  resetPassword,
  fetchUserData,
  customerLogout
} from "../controllers/AuthController";
import { protectedRoute } from "../../middlewares/authMiddleware";
import {adminServices,
  adminSubcategories,
  providerSubServices,
  categoriesOfServices,
  saveCustomerAddress,
  getCustomerAddress,
  customerProfile,
  saveProfileImage,
  customerEditPersonal,
  customerEditAddress,
  customerPasswordReset,
  getWallet,
  getTransactions
} from "../controllers/CustomerController"
import { create_checkout_session,stripeWebhook,cancelBooking  } from "../controllers/PaymentController";
import {customerBookings,bookingDetails} from "../controllers/OrderController";
import {
  showCoupons
} from "../controllers/OfferCouponController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/auth/refresh", refreshToken);
router.post("/auth/refreshCustomer", customerRefreshToken);
router.post("/auth/adminRefreshToken", adminRefreshToken);


router.post("/emailVerification", emailVerification);
router.post("/validateOtp", validateOtp);
router.post("/google", googleLogin);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/fetchUserData",customerAuthProtect, fetchUserData);
//customers routes
router.get("/adminServices", customerAuthProtect, adminServices);
router.get("/adminSubcategories/:id", customerAuthProtect, adminSubcategories);
router.post("/providerSubServices", customerAuthProtect, providerSubServices);
router.get("/categoriesOfServices/:serviceId", customerAuthProtect, categoriesOfServices);
router.patch("/saveCustomerAddress", customerAuthProtect, saveCustomerAddress);
router.get("/getCustomerAddress",customerAuthProtect, getCustomerAddress);
router.post("/create_checkout_session", customerAuthProtect, create_checkout_session);

router.post("/customerLogout",customerAuthProtect,  customerLogout);
router.get("/bookingList",customerAuthProtect,  customerBookings);
router.get("/customerProfile", customerAuthProtect, customerProfile);
router.post("/saveProfileImage", customerAuthProtect,  upload.single("image"),saveProfileImage);
router.patch("/customerEditPersonal", customerAuthProtect, customerEditPersonal);
router.patch("/customerEditAddress", customerAuthProtect, customerEditAddress);
router.post("/customerPasswordReset",customerAuthProtect, customerPasswordReset);

router.get("/showCoupons/:providerId", customerAuthProtect, showCoupons);
router.patch("/cancelBooking", customerAuthProtect, cancelBooking);
router.get("/wallet", customerAuthProtect, getWallet);
router.get("/transactions", customerAuthProtect, getTransactions);
router.get("/bookingDetails/:id", customerAuthProtect, bookingDetails);












export default router;
