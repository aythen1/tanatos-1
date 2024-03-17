import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
// Importa el TransferService
// import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService, // Inyecta el TransferService
  ) {}

  @Post('/create-session')
  async createSession() {
    return this.stripeService.createPaymentSession();
  }
  @Post('create-transfer')
  async createTransfer(
    @Body()
    transferData: {
      amount: number;
      group: string;
      destination: string;
    },
  ): Promise<any> {
    return this.stripeService.createTransfer(
      transferData.amount,
      transferData.group,
      transferData.destination,
    );
  }
  @Post('create-express-account')
  async createExpressAccount(): Promise<any> {
    return this.stripeService.createExpressAccount();
  }
  @Post('create-account-link')
  async createAccountLink(@Body() body: { acc: string }): Promise<any> {
    // Replace 'CONNECTED_ACCOUNT_ID' with the actual connected account ID
    return this.stripeService.createAccountLink(body.acc);
  }

  @Post('payment-sheet')
  async createPaymentSheet(
    @Body() body: { price: number; email: string },
  ): Promise<any> {
    return this.stripeService.createPaymentSheet(body.price, body.email);
  }

  @Get('/success')
  async success() {
    return this.stripeService.handlePaymentSuccess();
  }

  @Get('/cancel')
  async cancel() {
    return this.stripeService.handlePaymentCancel();
  }
}
