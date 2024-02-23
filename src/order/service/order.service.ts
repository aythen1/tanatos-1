import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { StoreFlorist } from '../../store/entities/store.entity';
import { Funeral } from '../../funeral/entities/funeral.entity';
import { Usuario } from '../../users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(StoreFlorist)
    private storeFloristRepository: Repository<StoreFlorist>,
    @InjectRepository(Funeral)
    private funeralRepository: Repository<Funeral>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createOrderDto, store_id, esquela_id, client_id) {
    const store = await this.storeFloristRepository.findOne({
      where: { id: store_id },
    });
    const esquela = await this.funeralRepository.findOne({
      where: { id: esquela_id },
    });
    const cliente = await this.usuarioRepository.findOne({
      where: { id: client_id },
    });

    if (!store) {
      throw new NotFoundException(
        `No se encontró ninguna tienda con el ID ${store_id}`,
      );
    }

    if (!esquela) {
      throw new NotFoundException(
        `No se encontró ninguna esquela con el ID ${esquela_id}`,
      );
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
      store,
      esquela,
      cliente,
    });

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find();
  }

  async findOne(id: string) {
    const orderId = parseInt(id, 10);
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['esquela', 'store', 'cliente'],
    });

    if (!order) {
      throw new NotFoundException(
        `No se encontró ningún pedido con el ID ${id}`,
      );
    }

    return order;
  }

  async update(id: string, updateOrderDto) {
    const order = await this.findOne(id);
    order.status = updateOrderDto.status || order.status;
    return await this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async findByStatus(status: string) {
    return await this.orderRepository.find({ where: { status } });
  }

  async findOrdersByStoreId(storeId: number, status?: string) {
    let orders;

    if (status) {
      orders = await this.orderRepository.find({
        where: { store: { id: storeId }, status: status },
        relations: ['store', 'esquela', 'cliente'],
      });
    } else {
      orders = await this.orderRepository.find({
        where: { store: { id: storeId } },
        relations: ['store', 'esquela', 'cliente'],
      });
    }

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        `No se encontraron pedidos para la tienda con ID ${storeId}`,
      );
    }

    return orders;
  }

  async findOrdersByUserId(userId: number, status?: string) {
    let orders;

    if (status) {
      orders = await this.orderRepository.find({
        where: { cliente: { id: userId }, status: status },
        relations: ['store', 'esquela', 'cliente'],
      });
    } else {
      orders = await this.orderRepository.find({
        where: { id: userId },
        relations: ['store', 'esquela', 'cliente'],
      });
    }

    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        `No se encontraron pedidos para el usuario con ID ${userId}`,
      );
    }

    return orders;
  }
}
