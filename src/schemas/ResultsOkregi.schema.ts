import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';
import { ApiProperty } from '@nestjs/swagger';

export type OkregiResultDocument = HydratedDocument<OkregiResult>;

@Schema({ collection: 'okregiResults' })
export class OkregiResult extends BaseResults {
  @ApiProperty({
    description: 'Number of okreg',
    example: 1,
  })
  @Prop()
  ['Nr okręgu']: number;
}

export const OkregiResultSchema = SchemaFactory.createForClass(OkregiResult);
