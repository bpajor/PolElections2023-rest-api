import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseResults } from './BaseResult.schema';
import { ApiProperty } from '@nestjs/swagger';

export type GminyResultDocument = HydratedDocument<GminyResult>;

@Schema({ collection: 'gminyResults' })
export class GminyResult extends BaseResults {
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

  @ApiProperty({
    description: 'Gmina name',
    example: 'Żegocina',
  })
  @Prop()
  ['Gmina']: string;
}

export const GminyResultSchema = SchemaFactory.createForClass(GminyResult);
