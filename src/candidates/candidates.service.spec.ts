import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from '../schemas/candidate.schema';
import {
  CandidateSenat,
  CandidateSenatSchema,
} from '../schemas/CandidateSenat.schema';
import { paramsDto } from './dto';
import { createParams } from './helpers/createParams.function';

describe('CandidatesService', () => {
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
      providers: [CandidatesService],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSejmCandidates', () => {
    it('should return all deputies', async () => {
      const params: paramsDto = createParams();
      const sejmCandidates = await service.getCandidates(params, 'sejm');
      expect(sejmCandidates.length).toEqual(460);
    });
    it('should return all duputies who are men and have profession "lekarz"', async () => {
      const params: paramsDto = createParams({
        sex: 'Mężczyzna',
        proffesion: 'lekarz',
      });
      const sejmCandidates = await service.getCandidates(params, 'sejm');
      expect(sejmCandidates).toHaveLength(6);
    });
    it('should return all candidates who are from list number 7 and okreg number 15', async () => {
      const params: paramsDto = createParams({
        is_deputy: false,
        o_num: '15',
        l_num: '7',
      });
      const sejmCandidates = await service.getCandidates(params, 'sejm');
      expect(sejmCandidates).toHaveLength(15);
    });
    it('should return Donald Franciszek TUSK', async () => {
      const params: paramsDto = createParams({
        c_pos: '1',
        min_vote_num: 200000,
      });
      const sejmCandidates = await service.getCandidates(params, 'sejm');
      expect(sejmCandidates).toHaveLength(1);
      expect(sejmCandidates[0]['Nazwisko i imiona']).toEqual(
        'Donald Franciszek TUSK',
      );
    });
    it('shuld return Janusz Marcin KOWALSKI', async () => {
      const params: paramsDto = createParams({
        c_pos: '4',
        o_num: '21',
        l_num: '4',
      });
      const sejmCandidates = await service.getCandidates(params, 'sejm');
      expect(sejmCandidates).toHaveLength(1);
      expect(sejmCandidates[0]['Nazwisko i imiona']).toEqual(
        'Janusz Marcin KOWALSKI',
      );
    });
    it('should return false', async () => {
      const params: paramsDto = createParams({ min_vote_num: 100000 });
      const sejmCandidates = await service.getCandidates(params, 'sejm');
      expect(
        sejmCandidates.some((candidate) => candidate['Liczba głosów'] < 100000),
      ).toBeFalsy();
    });
  });
  describe('getSenatCandidates', () => {
    it('should return all senators', async () => {
      const params: paramsDto = createParams({}, true);
      const senatCandidates = await service.getCandidates(params, 'senat');
      expect(senatCandidates).toHaveLength(100);
    });

    it('should return all senators who are women and have proffesion nauczyciel', async () => {
      const params: paramsDto = createParams(
        { sex: 'Kobieta', proffesion: 'nauczyciel' },
        true,
      );
      const senatCandidates = await service.getCandidates(params, 'senat');
      expect(senatCandidates).toHaveLength(2);
      expect(
        senatCandidates.some((candidate) => candidate['Płeć'] === 'Mężczyzna'),
      ).toBeFalsy();
      expect(
        senatCandidates.some(
          (candidate) => candidate['Zawód'] !== 'nauczyciel',
        ),
      ).toBeFalsy();
    });
    it('should return Adam Piotr BODNAR', async () => {
      const params: paramsDto = createParams({
        min_vote_num: 500000,
      });
      const senatCandidates = await service.getCandidates(params, 'senat');
      expect(senatCandidates).toHaveLength(1);
      expect(senatCandidates[0]['Nazwisko i imiona']).toEqual(
        'Adam Piotr BODNAR',
      );
    });
  });
});
