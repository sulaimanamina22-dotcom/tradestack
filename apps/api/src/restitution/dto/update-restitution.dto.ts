import { PartialType } from '@nestjs/mapped-types';
import { CreateRestitutionDto } from './create-restitution.dto';

export class UpdateRestitutionDto extends PartialType(CreateRestitutionDto) {}
