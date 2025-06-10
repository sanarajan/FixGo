import express from "express";
const router = express.Router();
import {
  getAllCustomers,
  getAllProviders,
  customerView,
  providerView,
  blockUnblockProvider,
  adminLogout
} from "../controllers/AdminController";
import {
  servicesList,
  addService,
  editService,
  deleteService,
  blockUnblock,
  servicesSubcategories,
  addServiceSubcategory,
  editServiceSubcategory,
  subcategoryBlock,
  deleteSubcategory
} from "../controllers/ServiceController";
import { protectedRoute } from "../../middlewares/authMiddleware";

router.get("/customers", protectedRoute, getAllCustomers);
router.get("/providers", protectedRoute, getAllProviders);
router.patch("/blockUnblockProvider/:id", protectedRoute, blockUnblockProvider);

router.get("/customerView/:id", protectedRoute, customerView);
router.get("/providerView/:id", protectedRoute, providerView);
router.get("/services", protectedRoute, servicesList);
router.post("/addService", protectedRoute, addService);
router.put("/editService/:id", protectedRoute, editService);
router.delete("/deleteService/:id", protectedRoute, deleteService);
router.patch("/blockUnblock/:id", protectedRoute, blockUnblock);

router.get("/servicesSubcategories", protectedRoute, servicesSubcategories);
router.post("/addServiceSubcategory", protectedRoute, addServiceSubcategory);
router.put("/editServiceSubcategory/:id", protectedRoute, editServiceSubcategory);
router.patch("/subcategoryBlock/:id", protectedRoute, subcategoryBlock);
router.delete("/deleteSubcategory/:id", protectedRoute, deleteSubcategory);
router.post("/adminLogout", protectedRoute, adminLogout);





export default router;
