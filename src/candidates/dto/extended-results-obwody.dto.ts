import { IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';

export class ExtendedResultsObwodyDto extends ResultsDto {
  @IsOptional()
  @IsString()
  o_num: string;
}
