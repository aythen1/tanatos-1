import { IsNotEmpty, IsString, IsDecimal, IsOptional } from 'class-validator';
import { Usuario } from '../../users/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { Cat } from 'src/cat/entities/cat.entity';

export class CreateStoreFloristDto {
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsString()
  readonly location: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '6' })
  readonly lat: number;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '6' })
  readonly lng: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  readonly clients?: Usuario[];

  @IsOptional()
  readonly orders?: Order[];

  @IsOptional()
  readonly usuario?: Usuario;

  @IsOptional()
  readonly cat?: Cat[];

  // Constructor para aceptar parámetros opcionales
}
