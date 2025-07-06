import express from "express";
const router = express.Router();

import {
  create_checkout_session,
  stripeWebhook,
} from "../controllers/PaymentController";

router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 Stripe webhook route hit!");
    await stripeWebhook(req, res);
  }
);

export default router;
