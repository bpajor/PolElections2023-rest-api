import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';
import { ApiProperty } from '@nestjs/swagger';

export type WojewodztwaResultDocument = HydratedDocument<WojewodztwaResult>;

@Schema({ collection: 'wojewodztwaResults' })
export class WojewodztwaResult extends BaseResults {
  @ApiProperty({
    description: 'Województwo name',
    example: 'małopolskie',
  })
  @Prop()
  ['Województwo']: string;
}

export const WojewodztwaResultSchema =
  SchemaFactory.createForClass(WojewodztwaResult);
