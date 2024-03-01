import { Injectable } from '@nestjs/common';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'pk_live_51OocYQGmE60O5ob7CponAE51NmwS0M1Ys3qFk6z9nOQIoIQwc6ZwIDDdjVDU4AW9rTI7YiNmxHQ227vXQzq5TGV100jZrXEd2h',
    );
  }
  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: 'pm_card_visa',
      customer: 'cus_PduSBB9pXxowfG',
      confirm: true,
      return_url: 'http://www.google.com',
      transfer_group: 'ORDER10',
    });
  }
  async createTransfer(
    amount: number,
    currency: string,
    destination: string,
  ): Promise<Stripe.Transfer> {
    try {
      const transfer = await this.stripe.transfers.create({
        amount,
        currency,
        destination,
        transfer_group: 'ORDER10', // Use the same transfer group
      });
      console.log('Transfer created successfully:', transfer);
      return transfer;
    } catch (error) {
      console.error('Error creating transfer:', error);
      throw error;
    }
  }
  findAll() {
    return `This action returns all stripe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update(id: number, updateStripeDto: UpdateStripeDto) {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}

('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');
