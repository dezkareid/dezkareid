import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  domainId: string;
}
