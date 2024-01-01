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

  @IsOptional()
  @IsString()
  o_num: string = undefined;

  @IsOptional()
  @IsString()
  c_pos: string = undefined;

  @IsOptional()
  @IsString()
  l_num: string = undefined;

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

  @IsOptional()
  @IsString()
  proffesion: string = undefined;

  @IsOptional()
  @IsString()
  home: string = undefined;

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
