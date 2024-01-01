import { IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ExtendedResultsWojewodztwaDto extends ResultsDto {
  @ApiProperty({
    description: 'Województwo',
    example: 'małopolskie',
    required: false,
  })
  @IsOptional()
  @IsString()
  woj: string;
}
