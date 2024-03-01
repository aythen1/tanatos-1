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
      console.log('esto es ord', ord);

      // const floristeriaAmount = totalAmount * 0.7;
      // const tanatorioAmount = totalAmount * 0.15;
      // const appTanatosAmount = totalAmount * 0.15;

      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '100.00',
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: '100.00',
                },
              },
            },
            payees: [
              {
                email_address: 'sb-y1pzw29104571_api1.business.example.com',
                amount: {
                  currency_code: 'USD',
                  value: '30.00',
                },
              },
              {
                email_address: 'sb-xwimt29130867@business.example.com',
                amount: {
                  currency_code: 'USD',
                  value: '30.00',
                },
              },
              {
                email_address: 'sb-qy3h329104565_api1.business.example.com',
                amount: {
                  currency_code: 'USD',
                  value: '40.00',
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
          return_url: `http://localhost:3000/pay-pal-order/capture-orders`,
          cancel_url: `http://localhost:3000/pay-pal-order/cancel-orders`,
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

      // Crear la orden de pago
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

      // Verificar el estado de los pagos individuales
      const orderID = response.data.id;
      const payees = order.purchase_units[0].payees;
      console.log(
        'Datos de la respuesta de la creación de la orden:',
        response.data,
      );
      console.log('Destinatarios del pago:', order.purchase_units[0].payees);

      for (const payee of payees) {
        try {
          const captureResponse = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
            {},
            {
              auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET,
              },
            },
          );

          console.log('captureResponse', captureResponse);

          console.log(`Pago exitoso para ${payee.email_address}`);
          // Aquí puedes realizar acciones adicionales según el resultado
        } catch (captureError) {
          console.error(
            `Error al capturar el pago para ${payee.email_address + orderID}:`,
            captureError,
          );
          // Puedes manejar el error según tus necesidades
        }
      }
      console.log(
        'ESTO ES MUY IMPORTANTE PORQUE ES RESPONSE.DATA',
        response.data,
      );
      return response.data;
    } catch (error) {
      console.error('Error al iniciar el proceso de pago:', error.message);
      throw new NotFoundException('Error al iniciar el proceso de pago');
    }
  }

  async captureOrder(token: string): Promise<string> {
    try {
      console.log('es aca donde se traba');
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
