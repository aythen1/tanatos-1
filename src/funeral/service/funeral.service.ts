import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Funeral } from '../entities/funeral.entity';
import { StoreFlorist } from '../../store/entities/store.entity';
import { Usuario } from '../../users/entities/user.entity';
import { Favorito } from 'src/favoritos/entities/favorito.entity';

@Injectable()
export class FuneralService {
  constructor(
    @InjectRepository(Funeral)
    private readonly funeralRepository: Repository<Funeral>,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(StoreFlorist)
    private readonly storeRepository: Repository<StoreFlorist>,
    @InjectRepository(Favorito)
    private readonly favoritoRepository: Repository<Favorito>,
  ) {}

  async create(createFuneralDto) {
    const newFuneral = this.funeralRepository.create(createFuneralDto);
    return this.funeralRepository.save(newFuneral);
  }

  async findAll() {
    return this.funeralRepository.find();
  }

  async findAllByUser(userId) {
    return this.funeralRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id) {
    const funeral = await this.funeralRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!funeral) {
      throw new NotFoundException(`Funeral with id ${id} not found`);
    }
    return funeral;
  }

  async update(id, data) {
    console.log(`Updating funeral with ID ${id}...`);
    try {
      const existingFuneral = await this.funeralRepository.findOne({
        where: { id: id },
      });
      if (!existingFuneral) {
        throw new NotFoundException(`Funeral with ID ${id} not found`);
      }
      const updatedFuneral = await this.funeralRepository.save({
        ...existingFuneral,
        ...data,
      });
      return updatedFuneral;
    } catch (error) {
      console.error(`Error updating funeral: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number) {
    // Buscar el funeral por su ID
    const funeral = await this.funeralRepository.findOne({
      where: { id: id },
      relations: ['favoritos'],
    });

    // Si no se encuentra el funeral, lanzar una excepción o manejar el caso según tu lógica de negocio
    if (!funeral) {
      throw new Error('Funeral not found');
    }

    // Eliminar todos los registros de la relación 'favoritos' del funeral
    await this.favoritoRepository.remove(funeral.favoritos);

    // Eliminar el funeral
    return this.funeralRepository.remove(funeral);
  }

  async removeAll() {
    // Obtener todos los funerales
    const funerals = await this.funeralRepository.find();

    // Iterar sobre cada funeral y eliminar sus relaciones antes de borrarlo
    for (const funeral of funerals) {
      // Eliminar los favoritos asociados a este funeral
      await this.favoritoRepository.delete({ funeral });

      // Luego puedes eliminar el funeral
      await this.funeralRepository.delete(funeral.id);
    }
  }

  async removeAllByUser(userId) {
    const result = await this.funeralRepository.delete({
      user: { id: userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `No funerals found for user with id ${userId}`,
      );
    }
    return result;
  }

  async getStoreProductsForFuneral(funeralUserId) {
    try {
      const funeralUser = await this.userRepository.findOne({
        where: { id: funeralUserId },
        relations: ['esquela'],
      });
      if (!funeralUser.esquela || funeralUser.esquela.length === 0) {
        throw new NotFoundException(
          'No esquelas found associated with funeral user.',
        );
      }
      const storeProductsPromises = funeralUser.esquela.map(async (esquela) => {
        const store = await this.storeRepository.findOne({
          where: { usuario: { id: esquela.id } },
          relations: ['cat'],
        });
        return store ? store.cat : [];
      });
      const storeProducts = await Promise.all(storeProductsPromises);
      return storeProducts.reduce(
        (accumulator, currentProducts) => accumulator.concat(currentProducts),
        [],
      );
    } catch (error) {
      throw new NotFoundException(
        `Error getting products for funeral user: ${error.message}`,
      );
    }
  }

  async searchByName(name: string): Promise<Funeral[]> {
    const searchString = String(name); // Convertir a cadena explícitamente
    return await this.funeralRepository
      .createQueryBuilder('funeral')
      .where(
        'funeral.name LIKE :name OR funeral.funeral_location LIKE :location',
        {
          name: `%${searchString}%`,
          location: `%${searchString}%`,
        },
      )
      .getMany();
  }

  async createBy(funeralId: number): Promise<Funeral> {
    console.log(funeralId);
    const funeralBy = await this.funeralRepository
      .createQueryBuilder('funeral')
      .leftJoinAndSelect('funeral.user', 'user')
      .where('funeral.id = :funeralId', { funeralId })
      .getOne();
    console.log(funeralBy);

    if (!funeralBy) {
      throw new NotFoundException(`Funeral with ID ${funeralId} not found`);
    }

    return funeralBy;
  }
}
