import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OkregiResult,
  OkregiResultSchema,
} from '../schemas/ResultsOkregi.schema';
import {
  WojewodztwaResult,
  WojewodztwaResultSchema,
} from '../schemas/WojewodztwaResults.schema';
import {
  PowiatyResult,
  PowiatyResultSchema,
} from '../schemas/ResultsPowiaty.schema';
import { GminyResult, GminyResultSchema } from '../schemas/GminyResult.schema';

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb+srv://pajor394:TACkxs0UNGUjDNBf@electionscluster.wir8tuv.mongodb.net/electionsDB',
        ),
        MongooseModule.forFeature([
          { name: OkregiResult.name, schema: OkregiResultSchema },
          { name: WojewodztwaResult.name, schema: WojewodztwaResultSchema },
          { name: PowiatyResult.name, schema: PowiatyResultSchema },
          { name: GminyResult.name, schema: GminyResultSchema },
        ]),
      ],
      providers: [ResultsService],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
