import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StoreFloristService } from '../store/store.service';
import { CreateStoreFloristDto } from '../store/dto/create-store.dto';

@Controller('store-florist')
export class StoreFloristController {
  constructor(private readonly storeFloristService: StoreFloristService) {}

  @Post(':userId')
  async create(
    @Body() createStoreFloristDto: CreateStoreFloristDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('name') name: string,
    @Body('location') location: string,
    @Body('lng') lng: number,
    @Body('lat') lat: number,
  ) {
    return this.storeFloristService.create(
      createStoreFloristDto,
      userId,
      name,
      location,
      lng,
      lat,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.storeFloristService.delete(id);
  }

  @Get(':id/user')
  async createBy(@Param('id') id: number) {
    return await this.storeFloristService.createBy(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    console.log('user');
    return await this.storeFloristService.findByUserId(userId);
  }

  @Get('search')
  async findByName(@Query('name') name: string) {
    return await this.storeFloristService.findByName(name);
  }

  @Get(':id/cats')
  async findCatsByStoreId(@Param('id', ParseIntPipe) id: number) {
    return await this.storeFloristService.findCatsByStoreId(id);
  }

  @Get('all-with-cats')
  async findAllWithCats() {
    return this.storeFloristService.findAllWithCats();
  }
}
