import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../users/entities/user.entity';
import { UsuarioService } from '../users/services/users.service';
import { UsuarioController } from '../users/controllers/users.controller';
import { Funeral } from '../funeral/entities/funeral.entity';
import { StoreFlorist } from 'src/store/entities/store.entity';
import { Favorito } from 'src/favoritos/entities/favorito.entity';
import { EmailService } from 'src/mail/mail.service';
import { EmailController } from 'src/mail/mail.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Funeral, StoreFlorist, Favorito]),
  ],
  controllers: [UsuarioController, EmailController],
  providers: [UsuarioService, EmailService],
})
export class UserTypeModule {}
