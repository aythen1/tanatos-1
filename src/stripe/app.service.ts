import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Injectable()
export class AppService {
  constructor(private readonly stripeService: StripeService) {}

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripeService.createPaymentIntent(amount, currency);
  }
}
