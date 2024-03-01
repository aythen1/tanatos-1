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

@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly emailService: EmailService,
  ) {}

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

  @Post('pass-change/:id')
  async changePass(@Param('id') id: string) {
    try {
      console.log(`cambiando clave random a usuario ${id}...`);
      const usuario = await this.usuarioService.passChange(+id);

      if (!usuario) {
        throw new NotFoundException(`User with ID ${id} does not exist.`);
      }

      // Extrae el correo electrónico del usuario y la contraseña generada
      const email = usuario.email; // Asumiendo que hay un campo 'email' en el modelo Usuario
      const username = usuario.username; // Asumiendo que hay un campo 'nombre' en el modelo Usuario
      const password = usuario.password;

      // Llama a la ruta sendPasswordChangeEmail con los datos obtenidos
      await this.emailService.sendPasswordChangeEmail(
        email,
        username,
        password,
      );

      return usuario;
    } catch (error) {
      console.error(
        `Error cambiando la contraseña del usuario ${id}: ${error.message}`,
      );
      throw error;
    }
  }
}
