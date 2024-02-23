import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async remove(id) {
    const funeral = await this.findOne(id);
    return this.funeralRepository.remove(funeral);
  }

  async removeAll() {
    return this.funeralRepository.delete({});
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
}
