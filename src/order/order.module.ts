import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { StoreFlorist } from '../store/entities/store.entity';
import { StoreFloristModule } from '../store/store.module';
import { Funeral } from '../funeral/entities/funeral.entity';
import { Usuario } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, StoreFlorist, Funeral, Usuario]),
    StoreFloristModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
