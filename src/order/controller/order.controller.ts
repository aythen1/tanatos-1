import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':store_id/:esquela_id/:client_id')
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Param('store_id') store_id: number,
    @Param('esquela_id') esquela_id: number,
    @Param('client_id') client_id: number,
  ) {
    return this.orderService.create(
      createOrderDto,
      store_id,
      esquela_id,
      client_id,
    );
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    return this.orderService.findByStatus(status);
  }

  @Get(':storeId/orders/:status')
  async findOrdersByStoreId(
    @Param('storeId') storeId: number,
    @Param('status') status: string,
  ) {
    return await this.orderService.findOrdersByStoreId(storeId, status);
  }

  @Get('user/:userId/:status')
  async findOrdersByUserId(
    @Param('userId') userId: number,
    @Param('status') status: string,
  ) {
    return await this.orderService.findOrdersByUserId(userId, status);
  }
}
