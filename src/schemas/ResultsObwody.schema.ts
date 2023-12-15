import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';

export type ObwodyResultDocument = HydratedDocument<ObwodyResult>;

@Schema({ collection: 'obwodyResults' })
export class ObwodyResult extends BaseResults {
  @Prop()
  ['Nr okręgu']: number;
}

export const ObwodyResultSchema = SchemaFactory.createForClass(ObwodyResult);
