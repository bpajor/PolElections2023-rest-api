import { IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ExtendedResultsGminyDto extends ResultsDto {
  @ApiProperty({
    description: 'Powiat',
    example: 'bocheński',
    required: false,
  })
  @IsOptional()
  @IsString()
  pow: string;

  @ApiProperty({
    description: 'Województwo',
    example: 'małopolskie',
    required: false,
  })
  @IsOptional()
  @IsString()
  woj: string;

  @ApiProperty({
    description: 'Number of the okreg',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  o_num: string;

  @ApiProperty({
    description: 'Gmina',
    example: 'Żegocina',
    required: false,
  })
  @IsOptional()
  @IsString()
  gmina: string;
}
