import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';

export type OkregiResultDocument = HydratedDocument<OkregiResult>;

@Schema({ collection: 'okregiResults' })
export class OkregiResult extends BaseResults {
  @Prop()
  ['Nr okręgu']: number;
}

export const OkregiResultSchema = SchemaFactory.createForClass(OkregiResult);
