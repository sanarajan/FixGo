"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const upload_1 = require("../../middlewares/upload");
const AdminController_1 = require("../controllers/AdminController");
const ProviderController_1 = require("../controllers/ProviderController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
router.get("/customersList", authMiddleware_1.protectedRoute, AdminController_1.getAllCustomers);
router.get("/customerView/:id", authMiddleware_1.protectedRoute, AdminController_1.customerView);
router.get("/providerServices", authMiddleware_1.protectedRoute, ProviderController_1.providerServices);
router.get("/allServices", authMiddleware_1.protectedRoute, ProviderController_1.alladminServicesList);
router.get("/adminSubcategoryList/:serviceId", authMiddleware_1.protectedRoute, ProviderController_1.adminSubcategoryList);
router.post("/providerAddService", authMiddleware_1.protectedRoute, upload_1.upload.single("image"), ProviderController_1.providerAddService);
router.put("/providerUpdateService/:id", authMiddleware_1.protectedRoute, upload_1.upload.single("image"), ProviderController_1.providerUpdateService);
router.delete("/deleteProviderService/:id", authMiddleware_1.protectedRoute, ProviderController_1.deleteProviderService);
router.patch("/providerServiceBlockUnblock/:id", authMiddleware_1.protectedRoute, ProviderController_1.providerServiceBlockUnblock);
router.get("/groupedProviderServices", authMiddleware_1.protectedRoute, ProviderController_1.groupedProviderServices);
// router.post("/addStaff", protectedRoute,upload.single("image"), addStaff);
exports.default = router;
//# sourceMappingURL=providerRoutes.js.map