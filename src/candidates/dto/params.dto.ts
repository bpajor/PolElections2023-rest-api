import { Transform } from 'class-transformer';
import {
  ArrayContains,
  Contains,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsSex } from '../decorators';
import { ApiProperty } from '@nestjs/swagger';

export class paramsDto {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  @ApiProperty({
    description: 'Is deputy',
    example: 'true',
  })
  is_deputy: boolean;

  @ApiProperty({
    description: 'Okreg number',
    example: '1',
    required: false
  })
  @IsOptional()
  @IsString()
  o_num: string = undefined;

  @ApiProperty({
    description: 'Candidate position on the list',
    example: '1',
    required: false
  })
  @IsOptional()
  @IsString()
  c_pos: string = undefined;

  @ApiProperty({
    description: 'List number (this is corresponding to the party number)',
    example: '1',
    required: false
  })
  @IsOptional()
  @IsString()
  l_num: string = undefined;

  @ApiProperty({
    description: 'sex of the candidate',
    example: 'M',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsSex()
  @Transform(({ value }) => {
    console.log('Wartość parametru: ', value);
    let valueToReturn = '';
    if (
      value === 'Mężczyzna,Kobieta' ||
      (!value.split(',').includes('K') && !value.split(',').includes('M'))
    )
      return value;
    // if (value. === 'M') valueToReturn += 'Mężczyzna';
    // if (value === 'K') return 'Kobieta';
    if (value.split(',').includes('M')) valueToReturn += 'Mężczyzna,';
    if (value.split(',').includes('K')) valueToReturn += 'Kobieta';
    return valueToReturn;
  })
  sex: string = undefined;

  @ApiProperty({
    description: 'Candidate profession',
    example: 'Lekarz',
    required: false
  })
  @IsOptional()
  @IsString()
  proffesion: string = undefined;

  @ApiProperty({
    description: 'Candidate place of residence',
    example: 'Warszawa',
    required: false
  })
  @IsOptional()
  @IsString()
  home: string = undefined;

  @ApiProperty({
    description: 'min value of votes obtained by candidates',
    example: '1000',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  min_vote_num: number = undefined;

  @ApiProperty({
    description: 'max value of votes obtained by candidates',
    example: '100000',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  max_vote_num: number = undefined;

  @ApiProperty({
    description: 'min value of percent of votes obtained by candidates in their districts (okregi)',
    example: '10',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  min_vote_percent: number = undefined;

  @ApiProperty({
    description: 'max value of percent of votes obtained by candidates in their districts (okregi)',
    example: '100',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseInt(value);
    }
    return value;
  })
  max_vote_percent: number = undefined;

  constructor() {
    this.sex = 'Mężczyzna,Kobieta';
  }
}
