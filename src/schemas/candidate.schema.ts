import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCandidate } from './BaseCandidate.schema';

export type CandidateDocument = HydratedDocument<Candidate>;

@Schema({ collection: 'candidates' })
export class Candidate extends BaseCandidate {
  // @Prop()
  // ['Nr okręgu']: number;
  @Prop()
  ['Nr listy']: number;
  // @Prop()
  // ['Pozycja na liście']: number;
  // @Prop()
  // ['Nazwisko i imiona']: string;
  // @Prop()
  // ['Nazwa komitetu']: string;
  // @Prop()
  // ['Płeć']: string;
  // @Prop()
  // ['Zawód']: string;
  // @Prop()
  // ['Miejsce zamieszkania']: string;
  // @Prop()
  // ['Liczba głosów']: number;
  // @Prop()
  // ['Procent głosów oddanych w okręgu']: string;
  // @Prop()
  // ['Czy przyznano mandat']: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
