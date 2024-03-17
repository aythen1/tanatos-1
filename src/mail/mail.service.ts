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

  async sendPasswordChangeEmail(
    email: string,
    nombre: string,
    pass: string,
    idioma: string,
  ) {
    try {
      let subject = 'Tanatos: ¡Se ha cambiado tu contraseña!';
      let content = `
        <h1>Hola ${nombre},</h1>
        <p>Al parecer no recuerdas tu clave de Tanatos!.</p>
        <p>Contraseña:  ${pass}.</p>
        <p>Esta de aquí arriba es tu clave, puedes acceder a tu cuenta con ella.</p>
        <br></br>
        <br></br>
        <p>Atentamente,</p>
        <p>el equipo Tanatos</p>
      `;

      if (idioma === 'en') {
        subject = 'Tanatos: Your password has been changed!';
        content = `
          <h1>Hello ${nombre},</h1>
          <p>It seems you've forgotten your Tanatos password!</p>
          <p>Password: ${pass}.</p>
          <p>This is your password, you can access your account with it.</p>
          <br></br>
          <br></br>
          <p>Best regards,</p>
          <p>Tanatos team</p>
        `;
      }

      const message = {
        from: 'tucorreo@gmail.com',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendOrderPlacedEmail(
    email: string,
    nombre: string,
    idPedido: number,
    idioma: string,
  ) {
    try {
      let subject = 'Tanatos: solicitud de flores en proceso.';
      let content = `
        <h1>Hola ${nombre}</h1>
        <p>¡Tu pedido ${idPedido} ha sido realizado exitosamente!</p>
        <p>En este momento estamos procesando tu pedido, en menos de 24hs le informaremos por este medio el estado de tal.</p>
        <p>Le sugerimos estarse atento/a a este canal.</p>          
        <br></br>
        <br></br>
        <p>Atentamente,</p>
        <p>el equipo de Tanatos.</p>
      `;

      if (idioma === 'en') {
        subject = 'Tanatos: Flower request in process.';
        content = `
          <h1>Hello ${nombre}</h1>
          <p>Your order ${idPedido} has been successfully placed!</p>
          <p>We are currently processing your order, within 24 hours we will inform you through this channel of its status.</p>
          <p>We suggest you to stay tuned to this channel.</p>
          <br></br>
          <br></br>
          <p>Best regards,</p>
          <p>Tanatos team.</p>
        `;
      }

      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendOrderApprovedEmail(
    email: string,
    nombre: string,
    idPedido: number,
    idioma: string,
  ) {
    try {
      let subject = 'Tanatos: solicitud aprobada, ultimo paso.';
      let content = `
        <h1>Hola ${nombre}</h1>
        <p>¡Ya puedes ingresar a la app y realizar tu pago por el pedido con numero ${idPedido}!</p>
        <p>Las flores seran preparadas para llegar a tu ser querido en cuanto cumplas este ultimo paso.</p>
        <p>Gracias por tu confianza.</p>
        <br></br>
        <br></br>
        <p>Atentamente,</p>
        <p>el equipo de Tanatos.</p>
      `;

      if (idioma === 'en') {
        subject = 'Tanatos: request approved, final step.';
        content = `
          <h1>Hello ${nombre}</h1>
          <p>You can now access the app and make your payment for order number ${idPedido}!</p>
          <p>The flowers will be prepared to reach your loved one as soon as you complete this final step.</p>
          <p>Thank you for your trust.</p>
          <br></br>
          <br></br>
          <p>Best regards,</p>
          <p>Tanatos team.</p>
        `;
      }

      const message = {
        from: 'azschiaffino@gmail.co',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendOrderPaidEmail(
    email: string,
    idPedido: number,
    nombre: string,
    monto: number,
    idioma: string,
  ) {
    try {
      let subject = 'Tanatos: pago finalizado, flores en camino.';
      let content = `
        <h1>Hola ${nombre}</h1>
        <p>Tu pedido en Tanatos con numero ${idPedido} ha sido pagado correctamente.</p>
        <p>El monto total de la factura fue de $${monto}.</p>
        <p>Gracias por hacernos parte, siempre estaremos para acompañarte.</p>
        <br></br>
        <br></br>
        <p>Atentamente,</p>
        <p>el equipo de Tanatos.</p>
      `;

      if (idioma === 'en') {
        subject = 'Tanatos: payment completed, flowers on the way.';
        content = `
          <h1>Hello ${nombre}</h1>
          <p>Your order in Tanatos with number ${idPedido} has been paid successfully.</p>
          <p>The total amount of the invoice was $${monto}.</p>
          <p>Thank you for being part of us, we will always be here to accompany you.</p>
          <br></br>
          <br></br>
          <p>Best regards,</p>
          <p>Tanatos team.</p>
        `;
      }

      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendOrderCancelEmail(
    email: string,
    idPedido: number,
    nombre: string,
    idioma: string,
  ) {
    try {
      let subject = 'Tanatos: se detuvo la entrega, pago cancelado.';
      let content = `
        <h1>Hola ${nombre}</h1>
        <p>Tu pedido en Tanatos con numero ${idPedido} ha sido cancelado.</p>
        <p>Este mensaje es para dejarte al tanto de la situacion del pedido.</p>
        <p>Si aun deseas hacerle llegar las flores a tu persona querida, siempre podras volver a su esquela y solicitar otro pedido.</p>
        <p>Gracias por tu confianza.</p>
        <br></br>
        <br></br>
        <p>Atentamente,</p>
        <p>el equipo de Tanatos.</p>
      `;

      if (idioma === 'en') {
        subject = 'Tanatos: delivery stopped, payment canceled.';
        content = `
          <h1>Hello ${nombre}</h1>
          <p>Your order in Tanatos with number ${idPedido} has been canceled.</p>
          <p>This message is to inform you about the status of the order.</p>
          <p>If you still want to send flowers to your loved one, you can always go back to their obituary and request another order.</p>
          <p>Thank you for your trust.</p>
          <br></br>
          <br></br>
          <p>Best regards,</p>
          <p>Tanatos team.</p>
        `;
      }

      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendWelcomeEmail(email: string, nombre: string, idioma: string) {
    try {
      let subject = '¡Bienvenido a Tanatos!';
      let content = `
        <h1>Hola ${nombre},</h1>
        <p>Has iniciado sesión exitosamente en tu cuenta.</p>
        <p>Lamentamos tu pérdida. En estos momentos difíciles, queremos acompañarte y ayudarte a encontrar las palabras que necesitas. En Tanatos, te ofrecemos una forma fácil y segura de encontrar las esquelas de tu zona y enviar flores a tus seres queridos.</p>
        <br></br>
        <br></br>
        <p>Atentamente,</p>
        <p>el equipo de Tanatos.</p>
      `;

      if (idioma === 'en') {
        subject = 'Welcome to Tanatos!';
        content = `
          <h1>Hello ${nombre},</h1>
          <p>You have successfully logged into your account.</p>
          <p>We're sorry for your loss. In these difficult times, we want to accompany you and help you find the words you need. At Tanatos, we offer you an easy and secure way to find obituaries in your area and send flowers to your loved ones.</p>
          <br></br>
          <br></br>
          <p>Best regards,</p>
          <p>Tanatos team.</p>
        `;
      }

      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
    idioma: string,
  ) {
    try {
      let subject = 'Tanatos: Restablecimiento de contraseña';
      let content = `
        <h1>Olvidó su contraseña?</h1>
        <p>Parece que has olvidado tu contraseña de Tanatos. No te preocupes, estamos aquí para ayudarte.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo electrónico de forma segura.</p>
      `;

      if (idioma === 'en') {
        subject = 'Tanatos: Password Reset';
        content = `
          <h1>Forgot your password?</h1>
          <p>It seems you've forgotten your Tanatos password. Don't worry, we're here to help.</p>
          <p>Click the following link to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        `;
      }

      const message = {
        from: 'azschiaffino@gmail.com',
        to: email,
        subject,
        html: content,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw error;
    }
  }
}
