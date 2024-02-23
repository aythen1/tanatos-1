import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsArray()
  items: any[];

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  total_amount: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  sympathy_text: string;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled', 'accepted'])
  status: string;

  @IsNotEmpty()
  @IsNumber()
  cliente_id: number;

  @IsNotEmpty()
  @IsNumber()
  store_id: number;

  @IsOptional()
  @IsNumber()
  esquela_id: number;

  @IsNotEmpty()
  @IsString()
  paypal_order_id: string;

  @IsNotEmpty()
  @IsEnum(['pending', 'completed', 'cancelled', 'accepted'])
  payment_status: string;
}
