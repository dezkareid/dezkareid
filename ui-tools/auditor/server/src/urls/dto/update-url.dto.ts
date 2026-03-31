import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto.js';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {}
