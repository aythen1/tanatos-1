import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  ParseIntPipe,
  NotFoundException,
  InternalServerErrorException,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CatService } from '../service/cat.service';
import { CreateCatDto } from '../dto/create-cat.dto';
import { UpdateCatDto } from '../dto/update-cat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import upload from 'src/upload';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post('flower')
  async create(@Body() createCatDto: CreateCatDto, @Res() res) {
    try {
      const newCat = await this.catService.create(createCatDto);
      return res.status(HttpStatus.CREATED).json(newCat);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('upload-image/:id')
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
    try {
      console.log('Archivo subido:', file);
      console.log('Subiendo imagen a Cloudinary...');
      const photoUrl = await upload(file.path);
      console.log('Imagen subida:', photoUrl);
      console.log(`Actualizando Cat con ID ${id}...`);
      const cat = await this.catService.findOne(id);
      if (!cat) {
        throw new NotFoundException(`Cat con ID ${id} no encontrado`);
      }
      cat.image = photoUrl;
      const updatedCat = await this.catService.update(id, cat);
      console.log('Cat actualizado:', updatedCat);
      return updatedCat;
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      throw new InternalServerErrorException('Error al procesar la solicitud');
    }
  }

  @Get()
  findAll() {
    return this.catService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catService.remove(+id);
  }
}
