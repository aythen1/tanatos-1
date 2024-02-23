import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreFlorist } from '../store/entities/store.entity';
import { Usuario } from '../users/entities/user.entity';
import { CreateStoreFloristDto } from '../store/dto/create-store.dto';

@Injectable()
export class StoreFloristService {
  constructor(
    @InjectRepository(StoreFlorist)
    private readonly storeFloristRepository: Repository<StoreFlorist>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(
    createStoreFloristDTO: CreateStoreFloristDto,
    userId: number,
    name: string,
    location: string,
    lat: number,
    lng: number,
  ) {
    try {
      console.log('Comenzando creación de tienda florista...');
      const user = await this.usuarioRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        console.log(`El usuario con ID ${userId} no fue encontrado.`);
        throw new NotFoundException(
          `El usuario con ID ${userId} no fue encontrado.`,
        );
      }
      const storeFlorist = new StoreFlorist();
      storeFlorist.phone = user.phone;
      storeFlorist.location = location;
      storeFlorist.lat = lat;
      storeFlorist.lng = lng;
      storeFlorist.name = name;
      storeFlorist.usuario = user;
      const createdStoreFlorist =
        await this.storeFloristRepository.save(storeFlorist);
      console.log('Tienda florista creada exitosamente.');
      return createdStoreFlorist;
    } catch (error) {
      console.error('Error al crear la tienda florista:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error al crear la tienda florista.',
        );
      }
    }
  }

  async delete(id: number) {
    try {
      console.log(`Eliminando tienda florista con ID ${id}...`);
      const result = await this.storeFloristRepository.delete(id);
      if (result.affected === 0) {
        console.log(`La tienda florista con ID ${id} no existe.`);
        throw new NotFoundException(
          `La tienda florista con ID ${id} no existe.`,
        );
      }
      console.log('Tienda florista eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar la tienda florista:', error.message);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error al eliminar la tienda florista.',
        );
      }
    }
  }

  async findByUserId(userId: number) {
    try {
      console.log(`Buscando tiendas floristas del usuario con ID ${userId}...`);
      const storeFlorists = await this.storeFloristRepository.find({
        where: { usuario: { id: userId } },
      });
      console.log(`Se encontraron ${storeFlorists.length} tiendas floristas.`);
      return storeFlorists;
    } catch (error) {
      console.error(
        'Error al buscar las tiendas floristas del usuario:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar las tiendas floristas del usuario.',
      );
    }
  }

  async findByName(name: string) {
    try {
      console.log(`Buscando tienda florista por nombre "${name}"...`);
      const storeFlorists = await this.storeFloristRepository.find({
        where: { name },
      });
      console.log(
        `Se encontraron ${storeFlorists.length} tiendas floristas con el nombre "${name}".`,
      );
      return storeFlorists;
    } catch (error) {
      console.error(
        'Error al buscar la tienda florista por nombre:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar la tienda florista por nombre.',
      );
    }
  }

  async findCatsByStoreId(storeId: number) {
    try {
      console.log(`Buscando gatos asociados a la tienda con ID ${storeId}...`);
      const store = await this.storeFloristRepository.findOne({
        where: { id: storeId },
        relations: ['cat'],
      });
      if (!store) {
        throw new NotFoundException(
          `Tienda florista con ID ${storeId} no encontrada`,
        );
      }
      const cats = store.cat;
      console.log(`Se encontraron ${cats.length} gatos asociados a la tienda.`);
      return cats;
    } catch (error) {
      console.error(
        'Error al buscar gatos asociados a la tienda:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar gatos asociados a la tienda',
      );
    }
  }

  async findAllWithCats() {
    try {
      console.log(
        'Buscando todas las tiendas floristas con sus gatos asociados...',
      );
      const cats = await this.storeFloristRepository.find({
        relations: ['cat', 'usuario'],
      });
      console.log('cats', cats);
      return cats;
    } catch (error) {
      console.error(
        'Error al buscar todas las tiendas floristas con sus gatos asociados:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Error al buscar todas las tiendas floristas con sus gatos asociados',
      );
    }
  }
}
