import { Module } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';
import { Usuario } from 'src/users/entities/user.entity';
import { Funeral } from 'src/funeral/entities/funeral.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities/favorito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito, Funeral, Usuario])],
  providers: [FavoritosService],
  controllers: [FavoritosController],
})
export class FavoritosModule {}
