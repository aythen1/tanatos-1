import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { EmailController } from './mail.controller';
import { UsuarioService } from 'src/users/services/users.service';
import { UsuarioController } from 'src/users/controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [EmailController, UsuarioController],
  providers: [EmailService, UsuarioService],
})
export class MailModule {}
