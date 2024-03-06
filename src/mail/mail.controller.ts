import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './mail.service';
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/login')
  async login(@Body() body: { email: string; nombre: string }) {
    // ...

    await this.emailService.sendWelcomeEmail(body.email, body.nombre);
  }

  @Post('/password-change')
  async sendPasswordChangeEmail(
    @Body() body: { email: string; nombre: string; pass: string },
  ) {
    await this.emailService.sendPasswordChangeEmail(
      body.email,
      body.nombre,
      body.pass,
    );
  }

  @Post('/order-placed')
  async sendOrderPlacedEmail(
    @Body() body: { email: string; nombre: string; idPedido: number },
  ) {
    await this.emailService.sendOrderPlacedEmail(
      body.email,
      body.nombre,
      body.idPedido,
    );
  }

  @Post('/order-approved')
  async sendOrderApprovedEmail(
    @Body() body: { email: string; nombre: string; idPedido: number },
  ) {
    await this.emailService.sendOrderApprovedEmail(
      body.email,
      body.nombre,
      body.idPedido,
    );
  }

  @Post('/order-canceled')
  async sendOrderCanceledEmail(
    @Body()
    body: {
      email: string;
      nombre: string;
      idPedido: number;
      monto: number;
    },
  ) {
    await this.emailService.sendOrderCancelEmail(
      body.email,
      body.idPedido,
      body.nombre,
    );
  }

  @Post('/order-paid')
  async sendOrderPaidEmail(
    @Body()
    body: {
      email: string;
      nombre: string;
      idPedido: number;
      monto: number;
    },
  ) {
    await this.emailService.sendOrderPaidEmail(
      body.email,
      body.idPedido,
      body.nombre,
      body.monto,
    );
  }

  @Post('/pass-change')
  async sendPasswordResetLink(@Body('email') email: string) {
    try {
      // Aquí debes construir el enlace para el restablecimiento de contraseña.
      const resetLink = `http://44792771-e1fc-43d6-bade-2a329516381c.pub.instances.scw.cloud:3000/usuarios/pass-change/${email}`;

      // Envía el correo electrónico con el enlace de restablecimiento.
      await this.emailService.sendPasswordResetEmail(email, resetLink);

      // Retorna una respuesta exitosa.
      return {
        message:
          'Se ha enviado el enlace de restablecimiento de contraseña al correo electrónico proporcionado.',
      };
    } catch (error) {
      // Maneja cualquier error y retorna una respuesta de error.
      console.error(
        'Error al enviar el correo electrónico de restablecimiento de contraseña:',
        error,
      );
      return {
        error:
          'Ha ocurrido un error al enviar el correo electrónico de restablecimiento de contraseña.',
      };
    }
  }
}
