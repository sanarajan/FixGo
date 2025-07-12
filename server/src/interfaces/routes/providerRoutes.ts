import express from "express";
const router = express.Router();
import { upload } from "../../middlewares/upload";

import { getAllCustomers, customerView } from "../controllers/AdminController";
import {
  providerServices,
  alladminServicesList,
  adminSubcategoryList,
  providerAddService,
  providerUpdateService,
  deleteProviderService,
  providerServiceBlockUnblock,
  groupedProviderServices,
  addStaff,
  staffList,
  editStaff,
  staffBlockUnblock,
  saveProfileImage,
  providerProfile,
  providerEditPersonal,
  providerEditAddress,
  providerPasswordReset,
  listingServiceForStaff,
  servicesAndSubcategories,
  getSubcategoriesByServiceId,
} from "../controllers/ProviderController";
import { bookingList } from "../controllers/OrderController";
import { saveStaffServices,fetchRejectedStaff } from "../controllers/StaffController";
import {
  addOffer,
  offerList,
  offerBlockUnblock,
  editOffer,
  addCoupon,
  couponList,
  editCoupon
} from "../controllers/OfferCouponController";
import { notifications } from "../controllers/NotificationController"
import { protectedRoute } from "../../middlewares/authMiddleware";
router.get("/customersList", protectedRoute, getAllCustomers);
router.get("/customerView/:id", protectedRoute, customerView);
router.get("/providerServices", protectedRoute, providerServices);
router.get("/allServices", protectedRoute, alladminServicesList);
router.get(
  "/adminSubcategoryList/:serviceId",
  protectedRoute,
  adminSubcategoryList
);
router.post(
  "/providerAddService",
  protectedRoute,
  upload.single("image"),
  providerAddService
);
router.put(
  "/providerUpdateService/:id",
  protectedRoute,
  upload.single("image"),
  providerUpdateService
);
router.delete(
  "/deleteProviderService/:id",
  protectedRoute,
  deleteProviderService
);
router.patch(
  "/providerServiceBlockUnblock/:id",
  protectedRoute,
  providerServiceBlockUnblock
);
router.get("/groupedProviderServices", protectedRoute, groupedProviderServices);
router.get("/listingServiceForStaff", protectedRoute, listingServiceForStaff);
router.post("/addStaff", protectedRoute, upload.single("image"), addStaff);
router.get("/staffList", protectedRoute, staffList);
router.patch(
  "/editStaff/:id",
  protectedRoute,
  upload.single("image"),
  editStaff
);
router.patch("/staffBlockUnblock/:id", protectedRoute, staffBlockUnblock);
router.post(
  "/saveProfileImage",
  protectedRoute,
  upload.single("image"),
  saveProfileImage
);
router.get("/providerProfile", protectedRoute, providerProfile);
router.patch("/providerEditPersonal", protectedRoute, providerEditPersonal);
router.patch("/providerEditAddress", protectedRoute, providerEditAddress);
router.post("/providerPasswordReset", protectedRoute, providerPasswordReset);
router.get("/bookingList", protectedRoute, bookingList);
router.post("/saveStaffServices", protectedRoute, saveStaffServices);
router.get(
  "/servicesAndSubcategories",
  protectedRoute,
  servicesAndSubcategories
);
router.get(
  "/getSubcategoriesByServiceId/:serviceId",
  protectedRoute,
  getSubcategoriesByServiceId
);
router.post("/addOffer", protectedRoute, addOffer);
router.get("/offerList", protectedRoute, offerList);
router.patch("/offerBlockUnblock/:id", protectedRoute, offerBlockUnblock);
router.post("/editOffer", protectedRoute, editOffer);
router.post("/addCoupon", protectedRoute,upload.single("couponImage"), addCoupon);
router.get("/couponList", protectedRoute, couponList);
router.patch("/editCoupon/:id", protectedRoute,upload.single("couponImage"), editCoupon);
router.get("/notifications", protectedRoute, notifications);
router.get("/fetchRejectedStaff/:staffId", protectedRoute, fetchRejectedStaff);





export default router;
