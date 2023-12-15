import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BaseResultsDocument = HydratedDocument<BaseResults>;

@Schema()
export class BaseResults {
  @Prop()
  ['Frekwencja']: string;

  @Prop()
  ['Procent głosów nieważnych']: string;

  @Prop()
  ['KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY']: string;

  @Prop()
  ['KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE']: string;

  @Prop()
  ['KOMITET WYBORCZY NOWA LEWICA']: string;

  @Prop()
  ['KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ']: string;

  @Prop()
  ['KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ']: string;

  @Prop()
  ['KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO .N IPL ZIELONI']: string;

  @Prop()
  ['KOMITET WYBORCZY POLSKA JEST JEDNA']: string;

  @Prop()
  ['KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU']: string;

  @Prop()
  ['KOMITET WYBORCZY NORMALNY KRAJ']: string;

  @Prop()
  ['KOMITET WYBORCZY ANTYPARTIA']: string;

  @Prop()
  ['KOMITET WYBORCZY RUCH NAPRAWY POLSKI']: string;

  @Prop()
  ['KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA']: string;
}

export const BaseResultsSchema = SchemaFactory.createForClass(BaseResults);
