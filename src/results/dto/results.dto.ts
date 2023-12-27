import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ResultsDto {
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

  // @IsNumber()
  // @IsOptional()
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     return parseFloat(value);
  //   }
  //   return value;
  // })
  // min_vote_perc: number;

  // @IsNumber()
  // @IsOptional()
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     return parseInt(value);
  //   }
  //   return value;
  // })
  // max_vote_perc: number;
}
