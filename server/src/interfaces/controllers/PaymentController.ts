import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { CreateCheckoutSessionUseCase } from "../../application/use-cases/customer/payment/CreateCheckoutSessionUseCase";
import { container } from "tsyringe";
import Stripe from "stripe";
import { OrdersModel } from "../../infrastructure/database/models/OrdersModel";
import { IOrder } from "../../domain/models/IOrder";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//this only for local usage. for public domain we use STRIPE_SECRET_KEY instead of this
const  endpointSecret = process.env.ENDPOINTSECRET
export const create_checkout_session = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
            console.log("reche")

    const { ordrData, savingOrder } = req.body;
        console.log("reche"+ordrData)

    let { amount, serviceId } = ordrData;

    const admin = (req as any).user;
    const customerId = admin.id;
console.log("Request Reached Controller");
console.log("ordrData:", ordrData);
console.log("savingOrder:", savingOrder);
console.log("amount:", amount);
console.log("customerId:", customerId);
console.log("serviceId:", serviceId);

    savingOrder.customerId = customerId;
    savingOrder.createdBy = customerId;
    if (!amount || !customerId || !serviceId) {
        console.log("Missing Fields:", { amount, customerId, serviceId });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    

    amount = Number(ordrData.amount); // Ensure it's number
if (isNaN(amount) || amount < 50) {
  console.log("Blocked too small amount", amount);
   res.status(400).json({ error: "Minimum payment amount is ₹50." });
    return;
}


    const services = container.resolve(CreateCheckoutSessionUseCase);
    const url = await services.execute({
      amount,
      customerId,
      serviceId,
      savingOrder,
    });

    console.log("reach last");
    res.json({ url });
  } catch (error:any) {
    console.error("PaymentController Error:", error);
  if (error?.raw?.code === "amount_too_small") {
    res.status(400).json({ error: "Minimum payment amount is ₹50." });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
  }
};

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
console.log(endpointSecret+" stripeid")
  const sig = req.headers["stripe-signature"];
  console.log("Webhook received with signature:", sig);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig!,
      // process.env.STRIPE_WEBHOOK_SECRET!
      endpointSecret as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return; 
  }

  if (event.type === "checkout.session.completed") {
console.log(" conmpleted")

    const session = event.data.object as Stripe.Checkout.Session;
    // console.log("Payment completed for session:", session.id);
      const paymentIntentId = session.payment_intent as string;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("No orderId found in metadata.");
      res.status(400).send("No orderId found in metadata.");
      return;
    }

    await OrdersModel.findByIdAndUpdate(orderId, {
      paymentStatus: "advance paid",
      bookingStatus:"Upcoming",
      paymentIntentId: paymentIntentId,
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: "BOOKED",
          at: new Date(),
          reason: "Payment completed via Stripe",
        },
      },
    });

  } else if (event.type === "checkout.session.expired") {
    console.log("session expired")
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Checkout session expired:", session.id);

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error("No orderId found in metadata.");
      res.status(400).send("No orderId found in metadata.");
      return;
    }

    // Update order as Cancelled
    await OrdersModel.findByIdAndUpdate(orderId, {
      bookingStatus: "Cancelled",
      paymentStatus: "Cancelled",
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: "Cancelled",
          at: new Date(),
          reason: "Checkout session expired",
        },
      },
    });

  } else if (event.type === "payment_intent.payment_failed") {

    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log("Payment failed for intent:", paymentIntent.id);

    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
      console.error("No orderId found in metadata.");
      res.status(400).send("No orderId found in metadata.");
      return;
    }

    // Update order as Payment Failed
    await OrdersModel.findByIdAndUpdate(orderId, {
      paymentStatus: "Failed",
      bookingStatus: "Cancelled",
      updatedAt: new Date(),
      $push: {
        statusHistory: {
          status: "PAYMENT FAILED",
          at: new Date(),
          reason: "Payment failed via Stripe",
        },
      },
    });

  }

  // Always send 200 response after handling the event
  res.status(200).send("Received webhook");
};
