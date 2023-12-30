import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from '../schemas/candidate.schema';
import {
  CandidateSenat,
  CandidateSenatSchema,
} from '../schemas/CandidateSenat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
    MongooseModule.forFeature([
      { name: CandidateSenat.name, schema: CandidateSenatSchema },
    ]),
  ],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule {}
