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

  async updatePasswordChange(body: { email: string; password: string }) {
    try {
      const { email, password } = body;

      // Verifica si la contraseña tiene 4 dígitos
      if (password.length !== 4 || !/^\d+$/.test(password)) {
        return { error: 'La contraseña debe ser un número de 4 dígitos' };
      }

      // Busca el usuario por correo electrónico
      const usuario = await this.usuarioRepository.findOne({
        where: { email },
      });

      // Verifica si el usuario existe
      if (!usuario) {
        return { error: 'Usuario no encontrado' };
      }

      // Hashea la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Actualiza la contraseña del usuario en la base de datos
      usuario.password = hashedPassword;
      await this.usuarioRepository.update(usuario.id, {
        password: hashedPassword,
      });

      const successMessage = `
      <html>
      <head>
        <title>Contraseña actualizada</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
          .message-container {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="message-container">
          <h1>Contraseña actualizada correctamente</h1>
        </div>
      </body>
      </html>
    `;

      // Retorna el HTML de éxito
      return successMessage;
    } catch (error) {
      // Maneja cualquier error y retorna un mensaje de error
      console.error('Error al actualizar la contraseña:', error.message);
      return { error: 'Ha ocurrido un error al actualizar la contraseña' };
    }
  }

  async addRecentSearch(id: number, searchQuery: string): Promise<Usuario> {
    console.log(`Añadiendo búsqueda reciente para el usuario con ID ${id}...`);
    try {
      // Busca el usuario por su ID
      const usuario = await this.usuarioRepository.findOne({
        where: { id: id },
      });

      // Verifica si el usuario existe
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Verifica si el usuario tiene la propiedad de búsquedas recientes, si no, inicialízala
      if (!usuario.recentSearch) {
        usuario.recentSearch = [];
      }

      // Agrega la nueva búsqueda al principio del array y limita el tamaño del array a, por ejemplo, 10 elementos
      usuario.recentSearch.unshift(searchQuery);
      usuario.recentSearch = usuario.recentSearch.slice(0, 10);

      // Guarda el usuario actualizado en la base de datos
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      console.error(
        `Error al agregar búsqueda reciente para el usuario con ID ${id}:`,
        error.message,
      );
      throw error;
    }
  }

  async getUserRecentSearches(userId: number): Promise<string[] | null> {
    console.log(
      `Buscando las búsquedas recientes del usuario con ID ${userId}...`,
    );
    try {
      const user = await this.usuarioRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }
      return user.recentSearch;
    } catch (error) {
      console.error(
        `Error al buscar las búsquedas recientes del usuario: ${error.message}`,
      );
      throw error;
    }
  }

  // servicio CRM

  async addStoreToTanatorio(id: number, storeId: string): Promise<Usuario> {
    const tanatorio = await this.usuarioRepository.findOne({
      where: { id: id },
    });
    if (!tanatorio) {
      throw new NotFoundException(`Tanatorio con ID ${id} no encontrado`);
    }
    if (!tanatorio.storeStockTanatorio) {
      tanatorio.storeStockTanatorio = [];
    }
    tanatorio.storeStockTanatorio.push(storeId);
    return this.usuarioRepository.save(tanatorio);
  }

  async removeStoreFromTanatorio(
    id: number,
    storeId: string,
  ): Promise<Usuario> {
    const tanatorio = await this.usuarioRepository.findOne({
      where: { id: id },
    });
    if (!tanatorio) {
      throw new NotFoundException(`Tanatorio con ID ${id} no encontrado`);
    }
    if (!tanatorio.storeStockTanatorio) {
      throw new NotFoundException(`No hay tiendas asociadas al tanatorio`);
    }
    tanatorio.storeStockTanatorio = tanatorio.storeStockTanatorio.filter(
      (s) => s !== storeId,
    );
    return this.usuarioRepository.save(tanatorio);
  }

  async removeAllTanatorioStores(tanatorioId: number): Promise<Usuario> {
    console.log(
      `Eliminando todas las tiendas asociadas al tanatorio con ID ${tanatorioId}...`,
    );
    try {
      const tanatorio = await this.usuarioRepository.findOne({
        where: { id: tanatorioId },
      });
      if (!tanatorio) {
        throw new NotFoundException(
          `Tanatorio con ID ${tanatorioId} no encontrado`,
        );
      }
      tanatorio.storeStockTanatorio = [];
      return this.usuarioRepository.save(tanatorio);
    } catch (error) {
      console.error(
        `Error al eliminar todas las tiendas asociadas al tanatorio: ${error.message}`,
      );
      throw error;
    }
  }
}
