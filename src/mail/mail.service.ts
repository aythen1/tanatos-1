import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'azschiaffino@gmail.com',
        pass: 'ynyb bmiy neig vowa',
      },
    });
  }

  // Aviso de cambio de clave
  async sendPasswordChangeEmail(email: string, nombre: string, pass: string) {
    try {
      const message = {
        from: 'tucorreo@gmail.com',
        to: email,
        subject: 'Tanatos: ¡Se ha cambiado tu contraseña!',
        html: `
          <h1>Hola ${nombre},</h1>
          <p>Se ha cambiado la contraseña de tu cuenta.</p>
          <p>Contraseña:  ${pass}.</p>
          <p>Si no has realizado este cambio, por favor contacta con nosotros inmediatamente al siguiente correo:</p>
          <br></br>
          <p>tanatosSupport@gmail.com</p>
          <br></br>
          <br></br>
          <p>Atentamente,</p>
          <p>el equipo Tanatos</p>



        `,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  // Aviso de solicitud de pedido realizado correctamente (falta confirmar o cancelar)

  async sendOrderPlacedEmail(email: string, nombre: string, idPedido: number) {
    try {
      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject: 'Tanatos: solicitud de flores en proceso.',
        html: `
        <h1>Hola ${nombre}</h1\>
        <p\>¡Tu pedido ${idPedido} ha sido realizado exitosamente!</p>
          <p>En este momento estamos procesando tu pedido, en menos de 24hs le informaremos por este medio el estado de tal.</p>
          <p>Le sugerimos estarse atento/a a este canal.</p>          
          <br></br>
          <br></br>
          <p>Atentamente,</p>
          <p>el equipo de Tanatos.</p>
        `,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }
  // Aviso para pagar tu pedido

  async sendOrderApprovedEmail(
    email: string,
    nombre: string,
    idPedido: number,
  ) {
    try {
      const message = {
        from: 'azschiaffino@gmail.co',
        to: email,
        subject: 'Tanatos: solicitud aprobada, ultimo paso.',
        html: `
          <h1>Hola ${nombre}</h1\>
<p\>¡Ya puedes ingresar a la app y realizar tu pago por el pedido con numero ${idPedido}!</p>
          <p>Las flores seran preparadas para llegar a tu ser querido en cuanto cumplas este ultimo paso.</p>
          <p>Gracias por tu confianza.</p>
          <br></br>
          <br></br>
          <p>Atentamente,</p>
          <p>el equipo de Tanatos.</p>
        `,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }
  // Aviso de pedido pagado/finalizado
  async sendOrderPaidEmail(
    email: string,
    idPedido: number,
    nombre: string,
    monto: number,
  ) {
    try {
      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject: 'Tanatos: pago finalizado, flores en camino.',
        html: `
          <h1>Hola ${nombre}</h1\>
<p\>Tu pedido en Tanatos con numero ${idPedido} ha sido pagado correctamente.</p>
          <p>El monto total de la factura fue de $${monto}.</p>
          <p>Gracias por hacernos parte, siempre estaremos para acompañarte.</p>
          <br></br>
          <br></br>
          <p>Atentamente,</p>
          <p>el equipo de Tanatos.</p>

        `,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendOrderCancelEmail(email: string, idPedido: number, nombre: string) {
    try {
      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject: 'Tanatos: se detuvo la entrega, pago cancelado.',
        html: `
          <h1>Hola ${nombre}</h1\>
<p\>Tu pedido en Tanatos con numero ${idPedido} ha sido cancelado.</p>
          <p>Este mensaje es para dejarte al tanto de la situacion del pedido.</p>
          <p>Si aun deceas hacerle llegar las flores a tu persona querida, siempre podras volver a su esquela y solicitar otro pedido.</p>
          <p>Gracias por tu confianza.</p>
          <br></br>
          <br></br>
          <p>Atentamente,</p>
          <p>el equipo de Tanatos.</p>

        `,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendWelcomeEmail(email: string, nombre: string) {
    try {
      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject: '¡Bienvenido a Tanatos!',
        html: `
          <h1>Hola ${nombre},</h1>
          <p>Has iniciado sesión exitosamente en tu cuenta.</p>
          <p>Lamentamos tu pérdida. En estos momentos difíciles, queremos acompañarte y ayudarte a encontrar las palabras que necesitas. En Tanatos, te ofrecemos una forma fácil y segura de encontrar las esquelas de tu zona y enviar flores a tus seres queridos.</p>
          <br></br>
          <br></br>
          <p>Atentamente,</p>
          <p>el equipo de Tanatos.</p>

        `,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }
}
