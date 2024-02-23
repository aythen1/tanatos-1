import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from '../config/data.source';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PayPalService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async intentPay(
    orderId: number,
    storeName: string,
    totalAmount: number,
  ): Promise<any> {
    try {
      const ord = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: [
          'store',
          'store.usuario',
          'cliente',
          'esquela',
          'esquela.user',
        ],
      });
      console.log(ord, 'esto es ord');

      const floristeriaAmount = totalAmount * 0.7;
      const tanatorioAmount = totalAmount * 0.15;
      const appTanatosAmount = totalAmount * 0.15;

      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalAmount.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: totalAmount.toFixed(2),
                },
              },
            },
            payees: [
              {
                email_address: 'sb-nkvso29618640@personal.example.com',
                amount: {
                  currency_code: 'USD',
                  value: floristeriaAmount.toFixed(2),
                },
              },
              {
                email_address: 'sb-flm0g29608509@business.example.com',
                amount: {
                  currency_code: 'USD',
                  value: tanatorioAmount.toFixed(2),
                },
              },
              {
                email_address: 'sb-xwimt29130867@business.example.com',
                amount: {
                  currency_code: 'USD',
                  value: appTanatosAmount.toFixed(2),
                },
              },
            ],
            description: `Pago dividido entre la floristería, el tanatorio y la aplicación de ${storeName}`,
          },
        ],
        application_context: {
          brand_name: storeName,
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `http://44792771-e1fc-43d6-bade-2a329516381c.pub.instances.scw.cloud:3000/pay-pal-order/capture-orders`,
          cancel_url: `http://44792771-e1fc-43d6-bade-2a329516381c.pub.instances.scw.cloud:3000/pay-pal-order/cancel-orders`,
        },
      };

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const {
        data: { access_token },
      } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      });
      console.log('esto es paypal id', access_token);

      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders`,
        order,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Error al iniciar el proceso de pago');
    }
  }

  async captureOrder(token: string): Promise<string> {
    try {
      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET,
          },
        },
      );
      console.log(response.data);
      return 'payed';
    } catch (error) {
      console.error('Error al capturar la orden de PayPal:', error.message);
      throw new Error('Error al capturar la orden de PayPal');
    }
  }

  async canceledOrder(orderId: number): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException(
          `No se encontró la orden con ID ${orderId}`,
        );
      }
      await this.orderRepository.delete(orderId);
      console.log(`Orden con ID ${orderId} eliminada exitosamente.`);
    } catch (error) {
      console.error('Error al cancelar la orden:', error.message);
      throw new Error('Error al cancelar la orden');
    }
  }
}
