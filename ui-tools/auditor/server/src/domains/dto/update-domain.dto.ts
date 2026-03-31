import { PartialType } from '@nestjs/mapped-types';
import { CreateDomainDto } from './create-domain.dto.js';

export class UpdateDomainDto extends PartialType(CreateDomainDto) {}
