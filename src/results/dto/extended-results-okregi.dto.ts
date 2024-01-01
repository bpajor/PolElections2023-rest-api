import { IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';
import { ApiAcceptedResponse, ApiProperty } from '@nestjs/swagger';

export class ExtendedResultsOkregiDto extends ResultsDto {
  @ApiProperty({
    description: 'Okreg number',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  o_num: string;
}
