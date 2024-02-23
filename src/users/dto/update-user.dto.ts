import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from '../dto/create-user.dto';
import { IsString, MaxLength, IsOptional, IsArray } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsString({ message: 'Username should be a string' })
  @MaxLength(30, { message: 'Username should be at most 30 characters long' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'Password should be a string' })
  @MaxLength(25, { message: 'Password should be at most 25 characters long' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Email should be a string' })
  @MaxLength(50, { message: 'Email should be at most 50 characters long' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Address should be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City should be a string' })
  @MaxLength(25, { message: 'City should be at most 25 characters long' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'State should be a string' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'Country should be a string' })
  @MaxLength(50, { message: 'Country should be at most 50 characters long' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Photo should be a string' })
  photo?: string;

  @IsOptional()
  @IsString({ message: 'Phone should be a string' })
  @MaxLength(20, { message: 'Phone should be at most 20 characters long' })
  phone?: string;

  // @IsOptional()
  // dob?: string;

  // @IsOptional()
  // @IsString({ message: 'User type should be a string' })
  // user_type?: string;

  @IsOptional()
  old_password?: string;

  // @IsOptional()
  // verificationCode?: string;

  // @IsOptional()
  // verificationCodeExpiration?: Date;

  @IsOptional()
  @IsArray({ message: 'Favoritos should be an array of numbers' })
  favoritos?: number[];
}
