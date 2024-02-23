import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cat } from '../entities/cat.entity';
import { v2 } from 'cloudinary';
import { CreateCatDto } from '../dto/create-cat.dto';
import { StoreFlorist } from 'src/store/entities/store.entity';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat)
    private readonly catRepository: Repository<Cat>,
    @InjectRepository(StoreFlorist)
    private readonly storeRepository: Repository<StoreFlorist>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const { store_id, ...catData } = createCatDto;

    // Verificar si la tienda existe
    const store = await this.storeRepository.findOne({
      where: { id: store_id },
    });
    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    // Crear una nueva instancia de Cat
    const newCat = this.catRepository.create({
      ...catData,
      store: store, // Asignar la tienda al nuevo Cat
    });

    try {
      // Guardar el nuevo Cat en la base de datos
      return await this.catRepository.save(newCat);
    } catch (error) {
      // Manejar errores
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async uploadImage(id: number, image: any): Promise<Cat> {
    console.log('Comenzando servicio de carga de imagen');
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }

    v2.config({
      secure: true,
      api_key: 'your_api_key',
      cloud_name: 'your_cloud_name',
      api_secret: 'your_api_secret',
    });

    try {
      const result = await v2.uploader.upload(image.path);
      const imageUrl = result.url;
      cat.image = imageUrl;
      await this.catRepository.save(cat);
      return cat;
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      throw new Error('Error al subir imagen a Cloudinary');
    }
  }

  async findAll(): Promise<Cat[]> {
    return this.catRepository.find();
  }

  async findOne(id: number): Promise<Cat> {
    return this.catRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCatDto: any): Promise<Cat> {
    const cat = await this.catRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    this.catRepository.merge(cat, updateCatDto);
    return this.catRepository.save(cat);
  }

  async remove(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }
}
