import { IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';

export class ExtendedResultsWojewodztwaDto extends ResultsDto {
  @IsOptional()
  @IsString()
  woj: string;
}
