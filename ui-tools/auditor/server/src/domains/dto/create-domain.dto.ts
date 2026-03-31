import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDomainDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
