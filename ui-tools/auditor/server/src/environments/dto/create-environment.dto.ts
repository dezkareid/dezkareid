import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  urlPrefix?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
