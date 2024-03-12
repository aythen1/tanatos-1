import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51OocYQGmE60O5ob7URy3YpGfHVIju6x3fuDdxXUy5R0rAdaorSHfskHNcBHToSoEfwJhFHtFDCguj7aGPlywD2pp00f2X9h9et',
    );
  }
  async createPaymentSession(): Promise<any> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 10000,
      currency: 'usd',
      transfer_group: 'ORDER10',
    });

    return paymentIntent;
  }

  async createExpressAccount(): Promise<any> {
    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
      });
      return account;
    } catch (error) {
      // Handle error
      throw error;
    }
  }
  async createAccountLink(acc: string): Promise<any> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: acc,
        refresh_url: 'https://example.com/reauth',
        return_url: 'https://example.com/return',
        type: 'account_onboarding',
      });
      return accountLink;
    } catch (error) {
      // Handle error
      throw error;
    }
  }
  async createPaymentSheet(price: number): Promise<any> {
    try {
      // Use an existing Customer ID if this is a returning customer.
      const customer = await this.stripe.customers.create();

      const ephemeralKey = await this.stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2023-10-16' },
      );
      const gr = 'group1';
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: price, // Use the price provided in the request body
        currency: 'eur',
        customer: customer.id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter
        // is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
        // application_fee_amount: 123,
        // transfer_data: {
        //   destination: 'acct_1Ot0jVGhmk7koxxT',
        // },
        transfer_group: gr,
      });
      console.log(paymentIntent, 'payment');

      return {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey:
          'sk_test_51OocYQGmE60O5ob7URy3YpGfHVIju6x3fuDdxXUy5R0rAdaorSHfskHNcBHToSoEfwJhFHtFDCguj7aGPlywD2pp00f2X9h9et',
      };
    } catch (error) {
      // Handle error
      throw error;
    }
  }
  async createTransfer(
    amount: number,
    group: string,
    destination: string,
  ): Promise<any> {
    try {
      const transfer = await this.stripe.transfers.create({
        amount,
        currency: 'eur',
        destination,
        transfer_group: group,
      });

      return transfer;
    } catch (error) {
      throw error;
    }
  }

  async handlePaymentSuccess(): Promise<any> {
    // Lógica para manejar el éxito de la transacción de pago
  }

  async handlePaymentCancel(): Promise<any> {
    // Lógica para manejar la cancelación de la transacción de pago
  }
}

('');
