import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../users/entities/user.entity';
import { Funeral } from '../../funeral/entities/funeral.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    @InjectRepository(Funeral)
    private funeralRepository: Repository<Funeral>,
  ) {}

  async findOneWithStore(id: number): Promise<Usuario> {
    console.log(`Buscando usuario con ID ${id} y su tienda...`);
    try {
      return await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.store', 'store')
        .leftJoinAndSelect('store.cat', 'cat')
        .where('usuario.id = :id', { id })
        .getOneOrFail();
    } catch (error) {
      console.error(`Error al buscar usuario con tienda: ${error.message}`);
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async create(createUsuarioDto: Partial<Usuario>): Promise<Usuario> {
    try {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      usuario.favoritos = [];
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      throw new NotFoundException(`Error al crear usuario: ${error.message}`);
    }
  }

  async findAll(): Promise<Usuario[]> {
    console.log('Buscando todos los usuarios...');
    try {
      return await this.usuarioRepository.find();
    } catch (error) {
      console.error(`Error al buscar usuarios: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<Usuario> {
    console.log(`Buscando usuario con ID ${id}...`);
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: id },
      });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      return usuario;
    } catch (error) {
      console.error(`Error al buscar usuario: ${error.message}`);
      throw error;
    }
  }

  async findStoreByUserId(id: number): Promise<Usuario> {
    console.log(`Buscando tienda para el usuario con ID ${id}...`);
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.store', 'store')
        .where('usuario.id = :id', { id })
        .getOneOrFail();

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      return usuario;
    } catch (error) {
      console.error(`Error al buscar tienda para usuario: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    console.log(`Actualizando usuario con ID ${id}...`);
    try {
      const usuarioExistente = await this.findOne(id);
      const usuarioActualizado = await this.usuarioRepository.save({
        ...usuarioExistente,
        ...usuario,
      });
      return usuarioActualizado;
    } catch (error) {
      console.error(`Error al actualizar usuario: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    console.log(`Eliminando usuario con ID ${id}...`);
    try {
      const usuario = await this.findOne(id);
      await this.usuarioRepository.remove(usuario);
    } catch (error) {
      console.error(`Error al eliminar usuario: ${error.message}`);
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<Usuario> {
    try {
      console.log(`Buscando usuario con email ${email}...`);

      const usuario = await this.usuarioRepository.findOne({
        where: { email },
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado`);
      }

      return usuario;
    } catch (error) {
      console.error(`Error al buscar usuario por email: ${error.message}`);
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
  }

  async updatePassword(id: number, newPassword: string): Promise<Usuario> {
    console.log(`Actualizando contraseña para el usuario con ID ${id}...`);
    try {
      const usuario = await this.findOne(id);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      usuario.password = hashedPassword;
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      console.error(`Error al actualizar la contraseña: ${error.message}`);
      throw error;
    }
  }
}
