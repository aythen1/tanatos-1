import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavoritoDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  funeralId: number;
}
