import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { PayPalService } from './pay-payl.service';

@Controller('pay-pal-order')
export class PayPalController {
  constructor(private readonly payPalService: PayPalService) {}

  @Post('/create-orders')
  async intentPay(
    @Body('orderId') orderId: number,
    @Body('storeName') storeName: string,
    @Body('totalAmount') totalAmount: number,
  ): Promise<any> {
    console.log('ENTRA');
    return this.payPalService.intentPay(orderId, storeName, totalAmount);
  }

  @Get('/capture-orders')
  captureOrder(@Query('token') token: string): any {
    return this.payPalService.captureOrder(token);
  }

  @Get('/cancel-orders/:orderId')
  canceledOrder(@Param('orderId') orderId: number): any {
    this.payPalService.canceledOrder(orderId);
    const htmlResponse = `
            <html>
            <head>
                <title>Cancelación de orden</title>
            </head>
            <body>
                <h1>Orden cancelada</h1>
                <p>La orden con ID ${orderId} ha sido cancelada.</p>
                <button onclick="closeWindow()">Cerrar ventana</button>
                <script>
                function closeWindow() {
                    window.close(); // Cierra la ventana del navegador
                }
                </script>
            </body>
            </html>
        `;
    return htmlResponse;
  }
}
