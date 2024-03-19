import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { UsuarioService } from '../../users/services/users.service';
import { CreateUsuarioDto } from '../dto/create-user.dto';
import { UpdateUsuarioDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import upload from '../../upload';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlink } from 'fs';
import { EmailService } from 'src/mail/mail.service';
import { Usuario } from '../entities/user.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly emailService: EmailService,
  ) {}

  @Get('funeral-store-by-state')
  async getFuneralAndStoreByState(@Res() res) {
    console.log('Obteniendo tanatorios y floristerias por estado...');
    const htmlContent =
      await this.usuarioService.getFuneralAndStoreByStateAsHTML();
    res.header('Content-Type', 'text/html'); // Establece el tipo de contenido como HTML
    res.status(200).send(htmlContent);
  }

  @Get(':id/products')
  async getUserStoreProducts(@Param('id') id: string) {
    console.log(
      `Buscando productos de la tienda para el usuario con ID ${id}...`,
    );
    const user = await this.usuarioService.findOneWithStore(+id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user.store;
  }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);
      createUsuarioDto.password = hashedPassword;
      const usuario = await this.usuarioService.create(createUsuarioDto);
      return usuario;
    } catch (error) {
      throw new BadRequestException(`Error al crear usuario: ${error.message}`);
    }
  }

  @Get()
  async findAll() {
    console.log('Buscando todos los usuarios...');
    return this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`Buscando usuario con ID ${id}...`);
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    console.log('updateUsuarioDto', updateUsuarioDto);
    console.log(`Actualizando usuario con ID ${id}...`);
    const usuario = await this.usuarioService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    Object.assign(usuario, updateUsuarioDto);
    return this.usuarioService.update(id, usuario);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    console.log(`Eliminando usuario con ID ${id}...`);
    return this.usuarioService.remove(id);
  }

  @Post('by-email')
  async findOneByEmail(@Body() body: { email: string }) {
    const { email } = body;
    console.log(`Buscando usuario con email ${email}...`);
    if (!email) {
      throw new BadRequestException('El campo email es requerido');
    }
    return this.usuarioService.findOneByEmail(email);
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
    console.log(file);
    const photoUrl = await upload(file.path);
    console.log(`Actualizando usuario con ID ${id}...`);
    console.log(photoUrl, 'esta seria la url');
    const usuario = await this.usuarioService.findOne(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    usuario.photo = photoUrl;
    unlink(file.path, (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
      } else {
        console.log('Archivo eliminado exitosamente');
      }
    });
    return this.usuarioService.update(id, usuario);
  }

  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    console.log('Iniciando sesión...');
    console.log('Email y contraseña recibidos:', email, password);
    try {
      console.log(`Buscando usuario con email: ${email}...`);
      const user = await this.usuarioService.findOneByEmail(email);
      if (!user) {
        console.log(`El usuario con email ${email} no fue encontrado.`);
        throw new NotFoundException('User not found');
      }
      console.log(
        `Verificando contraseña para el usuario con email: ${email}...`,
      );
      console.log('Usuario encontrado:', user);
      console.log('Contraseña recibida:', password);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Contraseña almacenada en la base de datos:', user.password);
      console.log('¿La contraseña es válida?', isPasswordValid);
      if (!isPasswordValid) {
        console.log(
          `Contraseña incorrecta para el usuario con email: ${email}.`,
        );
        throw new UnauthorizedException('Invalid credentials');
      }
      console.log(
        `Inicio de sesión exitoso para el usuario con email: ${email}.`,
      );
      const { id, username, email: userEmail, user_type } = user;
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: {
          id,
          username,
          email: userEmail,
          user_type,
        },
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
      }
    }
  }

  @Patch(':id/update-password')
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('newPassword') new_password: string,
    @Body('oldPassword') old_password: string,
  ) {
    console.log(`Actualizando contraseña para el usuario con ID ${id}...`);
    try {
      console.log('entra');
      const user = await this.usuarioService.findOne(id);
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      const isOldPasswordValid = await bcrypt.compare(
        old_password,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new BadRequestException('La contraseña antigua es incorrecta');
      }
      console.log('sigue');
      const hashedNewPassword = await bcrypt.hash(new_password, 10);
      user.old_password = old_password;
      user.password = hashedNewPassword;
      await this.usuarioService.update(id, user);
      console.log('a ver');
      return {
        statusCode: HttpStatus.OK,
        message: 'Contraseña actualizada correctamente',
        data: user,
      };
    } catch (error) {
      console.log('problema ');
      console.error('Error al actualizar la contraseña:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error al actualizar la contraseña',
      };
    }
  }

  @Get('store/:id')
  async findStoreByUserId(@Param('id') id: string) {
    console.log(`Buscando tienda para el usuario con ID ${id}...`);
    const store = await this.usuarioService.findStoreByUserId(+id);
    if (!store) {
      throw new NotFoundException(`User with ID ${id} does not have a store.`);
    }
    return store;
  }

  @Get('pass-change/:email/:token?') // El "?" indica que el token es opcional
  async showPasswordChangeForm(
    @Param('email') email: string,
    @Param('token') token?: string,
  ) {
    try {
      // Busca el usuario por su correo electrónico
      const usuario = await this.usuarioService.findOneByEmail(email);

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar si el token del usuario corresponde al proporcionado en la URL
      if (usuario.tokenClave !== token) {
        return { error: 'Este token no corresponde a este usuario' };
      }

      // Verifica si el usuario existe
      if (!usuario) {
        // Si no se encuentra el usuario, retorna un mensaje de error
        return { error: 'Usuario no encontrado' };
      }

      // Construye el HTML del formulario para cambiar la contraseña
      const passwordChangeForm = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cambia tu clave aquí</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #050505; /* Fondo gris */
        }
        form {
          width: 300px;
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.12); /* Fondo cristal 3D mate */
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(3.2px); /* Efecto de desenfoque */
          -webkit-backdrop-filter: blur(3.2px);
        }
        input {
          width: calc(100% - 20px); /* Ancho igual al botón */
          margin-bottom: 20px; /* Separación aumentada */
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 16px;
          box-sizing: border-box;
        }
        button {
          width: calc(100% - 20px); /* Ancho igual al input */
          padding: 10px;
          border: none;
          border-radius: 4px;
          background-color: #4caf50; /* Color verde */
          color: #ffffff; /* Letras blancas */
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background-color: #388e3c; /* Cambio de color al pasar el mouse */
        }
        h1 {
          color: #ffffff; /* Letras blancas */
          text-align: center;
          font-size: 24px;
          margin-bottom: 20px;
        }
        label {
          color: #ffffff; /* Letras blancas */
          font-size: 16px;
        }
        .error-message {
          color: #ff0000; /* Color rojo */
          font-size: 14px;
          margin-top: 5px;
        }
      </style>
      </head>
      <body>
      <form method="POST" action="/usuarios/update-password">
        <input type="hidden" name="email" value="${email}">
        <h1>Cambia tu contraseña</h1>
        <label for="password">Nueva contraseña:</label>
        <input type="password" id="password" name="password" required pattern="[0-9]{4,20}" title="Recuerde que debe ser numérica y tener de 4 a 20 dígitos">
        <span class="error-message">La contraseña debe ser numérica y tener entre 4 y 20 dígitos.</span>
        <button type="submit">Guardar cambios</button>
      </form>
      </body>
      </html>
      
      
    `;

      // Retorna el HTML del formulario
      return passwordChangeForm;
    } catch (error) {
      // Maneja cualquier error y retorna un mensaje de error
      console.error('Error al buscar usuario por email:', error.message);
      return { error: 'Ha ocurrido un error al buscar el usuario por email' };
    }
  }

  @Post('update-password')
  async updatePasswordChange(
    @Body() body: { email: string; password: string },
  ) {
    return await this.usuarioService.updatePasswordChange(body);
  }

  @Patch(':id/add-recent-search')
  async addRecentSearch(
    @Param('id', ParseIntPipe) id: number,
    @Body('searchQuery') searchQuery: string,
  ) {
    console.log(`Añadiendo búsqueda reciente para el usuario con ID ${id}...`);
    try {
      // Llama al método del servicio para agregar la búsqueda reciente
      const usuario = await this.usuarioService.addRecentSearch(
        id,
        searchQuery,
      );
      return { message: 'Búsqueda reciente agregada correctamente', usuario };
    } catch (error) {
      console.error('Error al agregar búsqueda reciente:', error.message);
      throw new BadRequestException('Error al agregar búsqueda reciente');
    }
  }

  @Get(':id/recent-searches')
  async getUserRecentSearches(@Param('id') id: string) {
    console.log(`Buscando las búsquedas recientes del usuario con ID ${id}...`);
    const userRecentSearches =
      await this.usuarioService.getUserRecentSearches(+id);
    if (!userRecentSearches) {
      throw new NotFoundException(
        `Búsquedas recientes del usuario con ID ${id} no encontradas`,
      );
    }
    return userRecentSearches;
  }

  // rutas de CRM

  @Post(':id/add-store')
  async addStoreToTanatorio(
    @Param('id') id: number,
    @Body() body: { storeId: string },
  ) {
    const { storeId } = body;
    return this.usuarioService.addStoreToTanatorio(id, storeId);
  }

  @Delete(':id/remove-store')
  async removeStoreFromTanatorio(
    @Param('id') id: number,
    @Body() body: { storeId: string },
  ) {
    const { storeId } = body;
    return this.usuarioService.removeStoreFromTanatorio(id, storeId);
  }

  @Delete(':id/tanatorio-stores')
  async removeAllTanatorioStores(@Param('id') id: string) {
    console.log(
      `Eliminando todas las tiendas asociadas al tanatorio con ID ${id}...`,
    );
    console.log('1');

    const result = await this.usuarioService.removeAllTanatorioStores(+id);
    return result;
  }

  @Post('search-city')
  async searchUsersByCity(
    @Body() searchBody: { city: string },
  ): Promise<Usuario[]> {
    const { city } = searchBody;
    return await this.usuarioService.searchByCity(city);
  }
}
