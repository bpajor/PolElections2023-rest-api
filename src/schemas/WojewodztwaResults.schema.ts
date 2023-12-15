import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';

export type WojewodztwaResultDocument = HydratedDocument<WojewodztwaResult>;

@Schema({ collection: 'wojewodztwaResults' })
export class WojewodztwaResult extends BaseResults {
  @Prop()
  ['Województwo']: string;
}

export const WojewodztwaResultSchema =
  SchemaFactory.createForClass(WojewodztwaResult);
