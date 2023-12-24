import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from '../schemas/candidate.schema';
import {
  CandidateSenat,
  CandidateSenatSchema,
} from '../schemas/CandidateSenat.schema';

describe('CandidatesController', () => {
  let controller: CandidatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb+srv://pajor394:TACkxs0UNGUjDNBf@electionscluster.wir8tuv.mongodb.net/electionsDB',
        ),
        MongooseModule.forFeature([
          { name: Candidate.name, schema: CandidateSchema },
        ]),
        MongooseModule.forFeature([
          { name: CandidateSenat.name, schema: CandidateSenatSchema },
        ]),
      ],
      controllers: [CandidatesController],
      providers: [CandidatesService],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
