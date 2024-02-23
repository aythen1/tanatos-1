import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class UpdateFuneralDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  funeral_date?: Date;

  @IsOptional()
  @IsString()
  funeral_time?: string;

  @IsOptional()
  @IsDateString()
  church_date?: Date;

  @IsOptional()
  @IsString()
  church_time?: string;

  @IsOptional()
  @IsString()
  funeral_location?: string;

  @IsOptional()
  @IsNumber()
  funeral_lat?: number;

  @IsOptional()
  @IsNumber()
  funeral_lng?: number;

  @IsOptional()
  @IsString()
  church_location?: string;

  @IsOptional()
  @IsNumber()
  church_lat?: number;

  @IsOptional()
  @IsNumber()
  church_lng?: number;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsString()
  funeral_image: string;

  @IsNotEmpty()
  @IsString()
  ceremonia_image: string;
}
