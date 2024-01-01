import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ResultsDto {
  @ApiProperty({
    description: 'Min percent of attendance',
    example: 60,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  min_attendance_percent: number;

  @ApiProperty({
    description: 'Max percent of attendance',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  max_attendance_percent: number;

  @ApiProperty({
    description: 'Max percent of invalid votes',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  max_invalid_votes_percent: number;

  @ApiProperty({
    description: 'Min percent of invalid votes',
    example: 60,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  })
  min_invalid_votes_percent: number;
}
