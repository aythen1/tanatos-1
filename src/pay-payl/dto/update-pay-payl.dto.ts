import { PartialType } from '@nestjs/mapped-types';
import { CreatePayPaylDto } from './create-pay-payl.dto';

export class UpdatePayPaylDto extends PartialType(CreatePayPaylDto) {}
