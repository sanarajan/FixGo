import express from "express";
const router = express.Router();
import { upload } from "../../middlewares/upload";

import {
  getAllCustomers,
  customerView,

} from "../controllers/AdminController";
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
    providerPasswordReset
} from "../controllers/ProviderController";
import {bookingList} from "../controllers/OrderController"
import { protectedRoute } from "../../middlewares/authMiddleware";

router.get("/customersList", protectedRoute, getAllCustomers);

router.get("/customerView/:id", protectedRoute, customerView);
router.get("/providerServices", protectedRoute, providerServices);
router.get("/allServices", protectedRoute, alladminServicesList);
router.get("/adminSubcategoryList/:serviceId", protectedRoute, adminSubcategoryList);
router.post("/providerAddService", protectedRoute,upload.single("image"), providerAddService);
router.put("/providerUpdateService/:id", protectedRoute, upload.single("image"),providerUpdateService);
router.delete("/deleteProviderService/:id", protectedRoute, deleteProviderService);
router.patch("/providerServiceBlockUnblock/:id", protectedRoute, providerServiceBlockUnblock);
router.get("/groupedProviderServices", protectedRoute, groupedProviderServices);
router.post("/addStaff", protectedRoute,upload.single("image"), addStaff);
router.get("/staffList", protectedRoute, staffList);
router.patch("/editStaff/:id", protectedRoute, upload.single("image"),editStaff);
router.patch("/staffBlockUnblock/:id", protectedRoute, staffBlockUnblock);
router.post("/saveProfileImage", protectedRoute,  upload.single("image"),saveProfileImage);
router.get("/providerProfile", protectedRoute, providerProfile);
router.patch("/providerEditPersonal", protectedRoute, providerEditPersonal);
router.patch("/providerEditAddress", protectedRoute, providerEditAddress);
router.post("/providerPasswordReset",protectedRoute, providerPasswordReset);
router.get("/bookingList",protectedRoute, bookingList);

















export default router;
