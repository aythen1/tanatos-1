import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPalController } from '../pay-payl/pay-payl.controller';
import { PayPalService } from './pay-payl.service';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PayPalController],
  providers: [PayPalService],
})
export class PayPalModule {}
