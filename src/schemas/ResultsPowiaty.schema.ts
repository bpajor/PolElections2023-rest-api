import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';
import { ApiProperty } from '@nestjs/swagger';

export type PowiatyResultDocument = HydratedDocument<PowiatyResult>;

@Schema({ collection: 'powiatyResults' })
export class PowiatyResult extends BaseResults {
  @ApiProperty({
    description: 'Number of okreg',
    example: 1,
  })
  @Prop()
  ['Nr okręgu']: number;

  @ApiProperty({
    description: 'Powiat name',
    example: 'bocheński',
  })
  @Prop()
  ['Powiat']: string;

  @ApiProperty({
    description: 'Województwo name',
    example: 'małopolskie',
  })
  @Prop()
  ['Województwo']: string;
}

export const PowiatyResultSchema = SchemaFactory.createForClass(PowiatyResult);
