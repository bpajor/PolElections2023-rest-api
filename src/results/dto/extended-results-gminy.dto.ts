import { IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';

export class ExtendedResultsGminyDto extends ResultsDto {
  //TODO change destination all results dto files
  @IsOptional()
  @IsString()
  pow: string;

  @IsOptional()
  @IsString()
  woj: string;

  @IsOptional()
  @IsString()
  o_num: string;

  @IsOptional()
  @IsString()
  gmina: string;
}
