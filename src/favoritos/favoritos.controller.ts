import {
  Controller,
  Post,
  Param,
  Get,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { Favorito } from './entities/favorito.entity';

@Controller('usuarios/:userId/favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Post('/:funeralId')
  async agregarFavorito(
    @Param('userId') userId: number,
    @Param('funeralId') funeralId: number,
  ): Promise<Favorito> {
    const res = await this.favoritosService.agregarFavorito(userId, funeralId);
    return res;
  }

  @Get()
  async obtenerFavoritos(@Param('userId') userId: number) {
    return this.favoritosService.obtenerFavoritos(userId);
  }

  @Delete(':id')
  async eliminarFavorito(@Param('id') favoritoId: number): Promise<void> {
    try {
      await this.favoritosService.eliminarFavorito(favoritoId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        // Otra manejo de errores si es necesario
        throw error;
      }
    }
  }
}
