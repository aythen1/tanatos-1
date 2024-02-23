import { Module } from '@nestjs/common';
import { FuneralService } from './service/funeral.service';
import { FuneralController } from './controller/funeral.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funeral } from './entities/funeral.entity';
import { Usuario } from '../users/entities/user.entity';
import { StoreFlorist } from '../store/entities/store.entity';
import { Favorito } from 'src/favoritos/entities/favorito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Funeral, Usuario, StoreFlorist, Favorito]),
  ],
  controllers: [FuneralController],
  providers: [FuneralService],
})
export class FuneralModule {}
