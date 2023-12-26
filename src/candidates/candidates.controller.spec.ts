import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from '../schemas/candidate.schema';
import {
  CandidateSenat,
  CandidateSenatSchema,
} from '../schemas/CandidateSenat.schema';
import { createParams } from './helpers/createParams.function';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

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
      providers: [
        {
          provide: CandidatesService,
          useValue: {
            getCandidates: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should call service with correct parameters', async () => {
    const params = createParams({ sex: 'M' });
    await controller.getSejm(params);
    expect(service.getCandidates).toHaveBeenCalledWith(params, 'sejm');
  });

  // it('should return the result from the service', async () => {
  //   const result = [{ name: 'John Doe' }];
  //   jest.spyOn(service, 'getCandidates').mockResolvedValue(result);
  //   expect(await controller.getSejm({})).toBe(result);
  // });
});
