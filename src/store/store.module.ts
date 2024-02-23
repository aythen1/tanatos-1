import { Module } from '@nestjs/common';
import { StoreFloristService } from '../store/store.service';
import { StoreFloristController } from '../store/store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreFlorist } from '../store/entities/store.entity';
import { Usuario } from '../users/entities/user.entity';
import { Cat } from 'src/cat/entities/cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreFlorist, Usuario, Cat])],
  controllers: [StoreFloristController],
  providers: [StoreFloristService],
})
export class StoreFloristModule {}
