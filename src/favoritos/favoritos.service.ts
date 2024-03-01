import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';
import { Usuario } from '../users/entities/user.entity';
import { Funeral } from '../funeral/entities/funeral.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private favoritoRepository: Repository<Favorito>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Funeral)
    private funerariaRepository: Repository<Funeral>,
  ) {}

  async agregarFavorito(userId: number, funeralId: number): Promise<Favorito> {
    console.log('userId:', userId);
    console.log('funeralId:', funeralId);

    const usuario = await this.usuarioRepository.findOne({
      where: { id: userId },
    });
    console.log('usuario:', usuario);

    const funeral = await this.funerariaRepository.findOne({
      where: { id: funeralId },
    });
    console.log('funeral:', funeral);

    if (!usuario || !funeral) {
      throw new NotFoundException(
        'No se encontró el usuario o el funeral especificado',
      );
    }
    // Verificar si ya existe un favorito con el mismo usuario y funeral
    const existingFavorite = await this.favoritoRepository.findOne({
      where: { usuario: usuario, funeral: funeral },
    });

    // Si ya existe un favorito para este usuario y funeral, lanzar una excepción
    if (existingFavorite) {
      throw new NotFoundException('No se puede agregar');
    }

    const favorito = new Favorito();
    favorito.usuario = usuario;
    favorito.funeral = funeral;
    console.log('favorito', favorito);

    // Guardar el favorito
    const favoritoGuardado = await this.favoritoRepository.save(favorito);

    // Realizar un set para asegurarse de que no haya duplicados
    const favoritosSinDuplicados = new Set();
    favoritosSinDuplicados.add(favoritoGuardado);
    return favoritoGuardado;
  }
  async obtenerFavoritos(userId: number): Promise<Favorito[]> {
    // Buscar en la tabla Favoritos todos los favoritos relacionados con el usuario específico (userId)
    const favoritos = await this.favoritoRepository.find({
      where: { usuario: { id: userId } },
      relations: ['funeral'], // Cargar la relación con la entidad Funeral
    });

    // Retornar el array de favoritos
    return favoritos;
  }

  async eliminarFavorito(userId: number, funeralId: number): Promise<void> {
    // Buscar el favorito por el ID del usuario y el ID del funeral
    const favorito = await this.favoritoRepository.findOne({
      where: { usuario: { id: userId }, funeral: { id: funeralId } },
    });

    // Verificar si el favorito existe
    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }

    // Eliminar el favorito de la base de datos
    await this.favoritoRepository.remove(favorito);
    return;
  }
}
