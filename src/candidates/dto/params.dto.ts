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

export class paramsDto {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
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
}
