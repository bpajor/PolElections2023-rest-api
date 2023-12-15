import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';

export type GminyResultDocument = HydratedDocument<GminyResult>;

@Schema({ collection: 'gminyResults' })
export class GminyResult extends BaseResults {
  @Prop()
  ['Nr okręgu']: number;

  @Prop()
  ['Powiat']: string;

  @Prop()
  ['Województwo']: string;

  @Prop()
  ['Gmina']: string;
}

export const GminyResultSchema = SchemaFactory.createForClass(GminyResult);
