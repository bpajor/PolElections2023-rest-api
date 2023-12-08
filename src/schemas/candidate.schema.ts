import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CandidateDocument = HydratedDocument<Candidate>;

@Schema()
export class Candidate {
  @Prop()
  ['Nr okręgu']: number;

  @Prop()
  ['Nr listy']: number;

  @Prop()
  ['Pozycja na liście']: number;

  @Prop()
  ['Nazwisko i imiona']: string;

  @Prop()
  ['Nazwa komitetu']: string;

  @Prop()
  ['Płeć']: string;

  @Prop()
  ['Zawód']: string;

  @Prop()
  ['Miejsce zamieszkania']: string;

  @Prop()
  ['Liczba głosów']: number;

  @Prop()
  ['Procent głosów oddanych w okręgu']: string;

  @Prop()
  ['Czy przyznano mandat']: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
