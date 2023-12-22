import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseCandidate } from './BaseCandidate.schema';

export type CandidateSenatDocument = HydratedDocument<CandidateSenat>;

@Schema({ collection: 'candidatesSenat' })
export class CandidateSenat extends BaseCandidate {}

export const CandidateSenatSchema =
  SchemaFactory.createForClass(CandidateSenat);
