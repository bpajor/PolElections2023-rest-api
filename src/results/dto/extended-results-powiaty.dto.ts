import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ResultsDto } from './results.dto';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExtendedResultsPowiatyDto extends ResultsDto {
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
  woj?: string;

  @ApiProperty({
    description: 'Number of the okreg',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  o_num?: string;
}
