import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';
import { Transform } from 'class-transformer';

export class ExtendedResultsPowiatyDto extends ResultsDto {
  @IsOptional()
  @IsString()
  pow: string;

  @IsOptional()
  @IsString()
  woj: string;

  @IsOptional()
  @IsString()
  o_num: string;
}
