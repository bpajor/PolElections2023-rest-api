import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';

export type PowiatyResultDocument = HydratedDocument<PowiatyResult>;

@Schema({ collection: 'powiatyResults' })
export class PowiatyResult extends BaseResults {
  @Prop()
  ['Nr okręgu']: number;

  @Prop()
  ['Powiat']: string;

  @Prop()
  ['Województwo']: string;
}

export const PowiatyResultSchema = SchemaFactory.createForClass(PowiatyResult);
