import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatService } from '../cat/service/cat.service';
import { CatController } from '../cat/controller/cat.controller';
import { Cat } from './entities/cat.entity';
import { StoreFlorist } from 'src/store/entities/store.entity';
import { StoreFloristModule } from 'src/store/store.module';
@Module({
  imports: [TypeOrmModule.forFeature([Cat, StoreFlorist]), StoreFloristModule],
  controllers: [CatController],
  providers: [CatService],
})
export class CatModule {}
