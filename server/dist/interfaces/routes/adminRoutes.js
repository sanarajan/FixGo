"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AdminController_1 = require("../controllers/AdminController");
const ServiceController_1 = require("../controllers/ServiceController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
router.get("/customers", authMiddleware_1.protectedRoute, AdminController_1.getAllCustomers);
router.get("/providers", authMiddleware_1.protectedRoute, AdminController_1.getAllProviders);
router.patch("/blockUnblockProvider/:id", authMiddleware_1.protectedRoute, AdminController_1.blockUnblockProvider);
router.get("/customerView/:id", authMiddleware_1.protectedRoute, AdminController_1.customerView);
router.get("/providerView/:id", authMiddleware_1.protectedRoute, AdminController_1.providerView);
router.get("/services", authMiddleware_1.protectedRoute, ServiceController_1.servicesList);
router.post("/addService", authMiddleware_1.protectedRoute, ServiceController_1.addService);
router.put("/editService/:id", authMiddleware_1.protectedRoute, ServiceController_1.editService);
router.delete("/deleteService/:id", authMiddleware_1.protectedRoute, ServiceController_1.deleteService);
router.patch("/blockUnblock/:id", authMiddleware_1.protectedRoute, ServiceController_1.blockUnblock);
router.get("/servicesSubcategories", authMiddleware_1.protectedRoute, ServiceController_1.servicesSubcategories);
router.post("/addServiceSubcategory", authMiddleware_1.protectedRoute, ServiceController_1.addServiceSubcategory);
router.put("/editServiceSubcategory/:id", authMiddleware_1.protectedRoute, ServiceController_1.editServiceSubcategory);
router.patch("/subcategoryBlock/:id", authMiddleware_1.protectedRoute, ServiceController_1.subcategoryBlock);
router.delete("/deleteSubcategory/:id", authMiddleware_1.protectedRoute, ServiceController_1.deleteSubcategory);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map