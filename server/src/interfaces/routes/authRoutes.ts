import express from "express";
import { customerAuthProtect } from "../../middlewares/customerMiddleware";

import {
  register,
  login,
  refreshToken, 
  customerRefreshToken, 
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
  getCustomerAddress
} from "../controllers/CustomerController"
import { create_checkout_session,stripeWebhook  } from "../controllers/PaymentController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/auth/refresh", refreshToken);
router.post("/auth/refreshCustomer", customerRefreshToken);


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







export default router;
