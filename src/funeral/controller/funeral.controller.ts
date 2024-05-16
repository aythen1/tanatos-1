import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  Query,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateFuneralDto } from '../dto/create-funeral.dto';
import { UpdateFuneralDto } from '../dto/update-funeral.dto';
import { FuneralService } from '../service/funeral.service';
import { StoreFlorist } from '../../store/entities/store.entity';
import { Repository } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import upload from '../../upload';
import { diskStorage } from 'multer';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import Multer from 'multer';
import { unlink } from 'fs';
import { Funeral } from '../entities/funeral.entity';
@Controller('funerals')
export class FuneralController {
  constructor(
    private readonly funeralService: FuneralService,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(StoreFlorist)
    private readonly storeRepository: Repository<StoreFlorist>,
  ) {}

  @Post()
  async create(@Body() createFuneralDto: CreateFuneralDto): Promise<any> {
    return this.funeralService.create(createFuneralDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return this.funeralService.findAll();
  }

  @Get('/user/:userId')
  async findAllByUser(@Param('userId') userId: number): Promise<any> {
    return this.funeralService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.funeralService.findOne(parseInt(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFuneralDto: UpdateFuneralDto,
  ): Promise<any> {
    return this.funeralService.update(parseInt(id), updateFuneralDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.funeralService.remove(parseInt(id));
  }

  @Delete()
  async removeAll(): Promise<any> {
    return this.funeralService.removeAll();
  }

  @Delete('/user/:userId')
  async removeAllByUser(@Param('userId') userId: number): Promise<any> {
    return this.funeralService.removeAllByUser(userId);
  }

  @Get('/:id/user')
  async createBy(@Param('id') userId: number): Promise<any> {
    return this.funeralService.createBy(userId);
  }

  @Get(':funeralUserId/products')
  async getStoreProductsForFuneral(
    @Param('funeralUserId') funeralUserId: number,
  ): Promise<any> {
    try {
      return await this.funeralService.getStoreProductsForFuneral(
        funeralUserId,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('upload-image-funeral/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    console.log(file);
    const photoUrl = await upload(file.path);
    console.log(`Actualizando usuario con ID ${id}...`);
    console.log(photoUrl, 'esta seria la url');
    const funeral = await this.funeralService.findOne(id);
    if (!funeral) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    funeral.image = photoUrl;
    unlink(file.path, (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
      } else {
        console.log('Archivo eliminado exitosamente');
      }
    });
    return this.funeralService.update(id, funeral);
  }

  // @Post('upload-image-funeral/:id')
  // @UseInterceptors(
  //   FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const randomName = Array(32)
  //           .fill(null)
  //           .map(() => Math.round(Math.random() * 16).toString(16))
  //           .join('');
  //         return cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(
  //   @UploadedFile() file: any,
  //   @Param('id') id: string,
  // ): Promise<any> {
  //   console.log(file, 'files');

  //   // Verificar si 'image' está presente y no es null
  //   const imageUrl = file.image ? await upload(file.image[0].path) : null;

  //   // Mapear las URL de las imágenes y manejar el caso de 'image' opcional
  //   const photoUrls = await Promise.all([
  //     imageUrl, // 'image' puede ser null
  //   ]);

  //   console.log(photoUrls, 'estas serían las URLs');

  //   const funeral = await this.funeralService.findOne(parseInt(id, 10));
  //   if (!funeral) {
  //     throw new NotFoundException(`Funeral con ID ${id} no encontrado`);
  //   }

  //   // Elimina los archivos de la carpeta uploads
  //   Object.values(file).forEach((fileArray) => {
  //     fileArray.forEach((file) => {
  //       unlink(file.path, (err) => {
  //         if (err) {
  //           console.error('Error al eliminar el archivo:', err);
  //         } else {
  //           console.log('Archivo eliminado exitosamente');
  //         }
  //       });
  //     });
  //   });

  //   // Asigna la URL de la imagen al funeral, si existe
  //   funeral.image = imageUrl;

  //   return this.funeralService.update(parseInt(id, 10), funeral);
  // }

  @Post('upload-images/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'ceremonia_image', maxCount: 1 },
        { name: 'funeral_image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async uploadFiles(
    @UploadedFiles() files: Record<string, Multer.File[]>,
    @Param('id') id: string,
  ): Promise<any> {
    console.log(files, 'files');

    // Verificar si 'image' está presente y no es null
    const imageUrl = files.image ? await upload(files.image[0].path) : null;

    // Mapear las URL de las imágenes y manejar el caso de 'image' opcional
    const photoUrls = await Promise.all([
      imageUrl, // 'image' puede ser null
      files.ceremonia_image ? upload(files.ceremonia_image[0].path) : null,
      files.funeral_image ? upload(files.funeral_image[0].path) : null,
    ]);

    console.log(photoUrls, 'estas serían las URLs');

    const funeral = await this.funeralService.findOne(parseInt(id, 10));
    if (!funeral) {
      throw new NotFoundException(`Funeral con ID ${id} no encontrado`);
    }

    // Elimina los archivos de la carpeta uploads
    Object.values(files).forEach((fileArray) => {
      fileArray.forEach((file) => {
        unlink(file.path, (err) => {
          if (err) {
            console.error('Error al eliminar el archivo:', err);
          } else {
            console.log('Archivo eliminado exitosamente');
          }
        });
      });
    });

    // Asigna la URL de la imagen al funeral, si existe
    funeral.image = imageUrl;
    funeral.ceremonia_image = photoUrls[1];
    funeral.funeral_image = photoUrls[2];

    return this.funeralService.update(parseInt(id, 10), funeral);
  }

  @Post('search')
  async searchFuneralsByName(
    @Body() searchBody: { name: string },
  ): Promise<Funeral[]> {
    const { name } = searchBody;
    return await this.funeralService.searchByName(name);
  }
}
