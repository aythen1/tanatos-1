import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './mail.service';
import * as crypto from 'crypto';
import { UsuarioService } from 'src/users/services/users.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post('/login')
  async login(@Body() body: { email: string; nombre: string; idioma: string }) {
    // ...

    await this.emailService.sendWelcomeEmail(
      body.email,
      body.nombre,
      body.idioma,
    );
  }

  @Post('/password-change')
  async sendPasswordChangeEmail(
    @Body()
    body: {
      email: string;
      nombre: string;
      idioma: string;
    },
  ) {
    await this.emailService.sendPasswordChangeEmail(
      body.email,
      body.nombre,
      body.idioma,
    );
  }

  @Post('/order-placed')
  async sendOrderPlacedEmail(
    @Body()
    body: {
      email: string;
      nombre: string;
      idPedido: number;
      idioma: string;
    },
  ) {
    await this.emailService.sendOrderPlacedEmail(
      body.email,
      body.nombre,
      body.idPedido,
      body.idioma,
    );
  }

  @Post('/order-approved')
  async sendOrderApprovedEmail(
    @Body()
    body: {
      email: string;
      nombre: string;
      idPedido: number;
      idioma: string;
    },
  ) {
    await this.emailService.sendOrderApprovedEmail(
      body.email,
      body.nombre,
      body.idPedido,
      body.idioma,
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
      idioma: string;
    },
  ) {
    await this.emailService.sendOrderCancelEmail(
      body.email,
      body.idPedido,
      body.nombre,
      body.idioma,
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
      idioma: string;
    },
  ) {
    await this.emailService.sendOrderPaidEmail(
      body.email,
      body.idPedido,
      body.nombre,
      body.monto,
      body.idioma,
    );
  }

  @Post('/pass-change')
  async sendPasswordResetLink(
    @Body('email') email: string,
    @Body('idioma') idioma: string,
  ) {
    try {
      // Generar un token seguro basado en el correo electrónico del usuario
      const token = crypto
        .createHmac('sha256', 'clave_secreta')
        .update(email)
        .digest('hex');
      // Construir el enlace para el restablecimiento de contraseña con el token incluido
      await this.usuarioService.guardarTokenClave(email, token);

      const resetLink = `http://44792771-e1fc-43d6-bade-2a329516381c.pub.instances.scw.cloud:3000/usuarios/pass-change/${email}/${token}`;

      // Envía el correo electrónico con el enlace de restablecimiento.
      await this.emailService.sendPasswordResetEmail(email, resetLink, idioma);

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
