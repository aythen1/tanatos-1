import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Post('payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string },
  ): Promise<Stripe.PaymentIntent> {
    return this.stripeService.createPaymentIntent(body.amount, body.currency);
  }

  @Post('payment-transfer') // Define la ruta para la creación de transferencias
  async createTransfer(
    @Body() body: { amount: number; currency: string; destination: string },
  ): Promise<Stripe.Transfer> {
    return this.stripeService.createTransfer(
      body.amount,
      body.currency,
      body.destination,
    );
  }

  @Get()
  findAll() {
    return this.stripeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripeDto: UpdateStripeDto) {
    return this.stripeService.update(+id, updateStripeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeService.remove(+id);
  }
}
