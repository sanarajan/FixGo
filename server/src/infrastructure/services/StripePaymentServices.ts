import Stripe from 'stripe';
import { injectable } from 'tsyringe';
import { IPaymentService } from '../../domain/services/IPaymentService';
import  {  Document, Types } from 'mongoose';

@injectable()
export class StripePaymentService implements IPaymentService {
  private stripe: Stripe;


  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCheckoutSession(data: {
    amount: number;
    customerId: string;
    serviceId: string;
    savingOrderId?: Types.ObjectId|string; // Optional, can be used for additional order details
  }): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Service Booking',
              description: `Service ID: ${data.serviceId}`,
            },
            unit_amount: data.amount * 100, // in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}payment-cancel`,
      metadata: {
        customerId: data.customerId,
        serviceId: data.serviceId,
        orderId: data.savingOrderId ? String(data.savingOrderId) : "",
      },
    });
console.log(session.url+" url")
    return session.url!;
  }
}
