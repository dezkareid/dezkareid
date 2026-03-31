import { IsUUID, IsNotEmpty } from 'class-validator';

export class TriggerAuditDto {
  @IsUUID()
  @IsNotEmpty()
  urlId: string;

  @IsUUID()
  @IsNotEmpty()
  environmentId: string;
}
