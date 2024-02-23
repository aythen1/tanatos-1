import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreFloristDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreFloristDto) {}
