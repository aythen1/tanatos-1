import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateFuneralDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  funeral_date: Date;

  @IsNotEmpty()
  @IsString()
  funeral_time: string;

  @IsNotEmpty()
  @IsDateString()
  church_date: Date;

  @IsNotEmpty()
  @IsString()
  church_time: string;

  @IsNotEmpty()
  @IsString()
  funeral_location: string;

  @IsNotEmpty()
  @IsNumber()
  funeral_lat: number;

  @IsNotEmpty()
  @IsNumber()
  funeral_lng: number;

  @IsNotEmpty()
  @IsString()
  church_location: string;

  @IsNotEmpty()
  @IsNumber()
  church_lat: number;

  @IsNotEmpty()
  @IsNumber()
  church_lng: number;

  @IsNotEmpty()
  @IsString()
  funeral_image: string;

  @IsNotEmpty()
  @IsString()
  ceremonia_image: string;
}
