import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type BaseResultsDocument = HydratedDocument<BaseResults>;

@Schema()
export class BaseResults {
  @ApiProperty({
    description: 'Attendance percentage',
    example: '10.55'
  })
  @Prop()
  ['Frekwencja']: string;

  @ApiProperty({
    description: 'Percentage of invalid votes',
    example: '2.55'
  })
  @Prop()
  ['Procent głosów nieważnych']: string;

  @ApiProperty({
    example: '3'
  })
  @Prop()
  ['KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY']: string;

  @ApiProperty({
    example: '13'
  })
  @Prop()
  ['KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE']: string;

  @ApiProperty({
    example: '5'
  })
  @Prop()
  ['KOMITET WYBORCZY NOWA LEWICA']: string;

  @ApiProperty({
    example: '35'
  })
  @Prop()
  ['KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ']: string;

  @ApiProperty({
    example: '10'
  })
  @Prop()
  ['KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ']: string;

  @ApiProperty({
    example: '32'
  })
  @Prop()
  ['KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N IPL ZIELONI']: string;

  @ApiProperty({
    example: '2'
  })
  @Prop()
  ['KOMITET WYBORCZY POLSKA JEST JEDNA']: string;

  @ApiProperty({
    example: '1'
  })
  @Prop()
  ['KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU']: string;

  @ApiProperty({
    example: '1'
  })
  @Prop()
  ['KOMITET WYBORCZY NORMALNY KRAJ']: string;

  @ApiProperty({
    example: '1'
  })
  @Prop()
  ['KOMITET WYBORCZY ANTYPARTIA']: string;

  @ApiProperty({
    example: '1'
  })
  @Prop()
  ['KOMITET WYBORCZY RUCH NAPRAWY POLSKI']: string;

  @ApiProperty({
    example: '1'
  })
  @Prop()
  ['KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA']: string;
}

export const BaseResultsSchema = SchemaFactory.createForClass(BaseResults);
