import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from '../schemas/candidate.schema';
import {
  CandidateSenat,
  CandidateSenatSchema,
} from '../schemas/CandidateSenat.schema';
import { paramsDto } from './dto';
import { createParams } from './helpers/createParams.function';
import { Model } from 'mongoose';
import { createMockCandidate } from './helpers/createMockCandidate.function';
import { BaseCandidate } from 'src/schemas/BaseCandidate.schema';
import { BaseFilter } from './interfaces/BaseFilter.interface';
import { SejmFilter } from './interfaces/SejmFilter.interface';
import { SenatFilter } from './interfaces/SenatFilter.interface';
import { performCandidateFilterFnTest } from './helpers/performCandidateFilterFnTest.function';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CandidatesService', () => {
  let service: CandidatesService;

  let candidateModel: Model<Candidate>;
  let candidateSenatModel: Model<CandidateSenat>;

  const mockResultsService = {
    find: jest.fn(),
    getSejm: jest.fn(),
    getSenat: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getModelToken(Candidate.name),
          useValue: mockResultsService,
        },
        {
          provide: getModelToken(CandidateSenat.name),
          useValue: mockResultsService,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
    candidateModel = module.get<Model<Candidate>>(
      getModelToken(Candidate.name),
    );
    candidateSenatModel = module.get<Model<CandidateSenat>>(
      getModelToken(CandidateSenat.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('filterByMinAndMaxVotePercent', () => {
    it('should return all sejm candidates with vote percent between 0.1 and 0.2', async () => {
      performCandidateFilterFnTest({
        filterFn: service.filterbyMinAndMaxVotePercent,
        minFilter: 0.1,
        maxFilter: 0.2,
        firstCandidateCreationOptions: { 'Nr listy': 1 },
        secondCandidateCreationOptions: {
          'Procent głosów oddanych w okręgu': '0,15',
          'Nr listy': 1,
        },
        expectedLength: 1,
        candidateType: 'sejm',
      });
    });

    it('should return all senat candidates with vote percent between 0.1 and 0.2', async () => {
      performCandidateFilterFnTest({
        filterFn: service.filterbyMinAndMaxVotePercent,
        minFilter: 0.1,
        maxFilter: 0.2,
        firstCandidateCreationOptions: {},
        secondCandidateCreationOptions: {
          'Procent głosów oddanych w okręgu': '0,15',
        },
        expectedLength: 1,
        candidateType: 'senat',
      });
    });

    it('should return input candidates if min_vote_percent and max_vote_percent are undefined', async () => {
      performCandidateFilterFnTest({
        filterFn: service.filterbyMinAndMaxVotePercent,
        minFilter: undefined,
        maxFilter: undefined,
        firstCandidateCreationOptions: {},
        secondCandidateCreationOptions: {
          'Procent głosów oddanych w okręgu': '0,15',
        },
        expectedLength: 2,
        candidateType: 'sejm',
      });
    });
  });

  describe('filterByMinAndMaxVoteNum', () => {
    it('should return all sejm candidates with vote num between 1000 and 2000', async () => {
      performCandidateFilterFnTest({
        filterFn: service.filterbyMinAndMaxVoteNum,
        minFilter: 1000,
        maxFilter: 2000,
        firstCandidateCreationOptions: { 'Nr listy': 1 },
        secondCandidateCreationOptions: {
          'Liczba głosów': 2500,
          'Nr listy': 1,
        },
        expectedLength: 1,
        candidateType: 'sejm',
      });
    });

    it('should return empty array', async () => {
      performCandidateFilterFnTest({
        filterFn: service.filterbyMinAndMaxVoteNum,
        minFilter: 3000,
        maxFilter: 4000,
        firstCandidateCreationOptions: {},
        secondCandidateCreationOptions: {
          'Liczba głosów': 2000,
        },
        expectedLength: 0,
        candidateType: 'senat',
      });
    });

    it('should return input candidates if min_vote_num and max_vote_num are undefined', async () => {
      performCandidateFilterFnTest({
        filterFn: service.filterbyMinAndMaxVoteNum,
        minFilter: undefined,
        maxFilter: undefined,
        firstCandidateCreationOptions: {},
        secondCandidateCreationOptions: {
          'Liczba głosów': 2000,
        },
        expectedLength: 2,
        candidateType: 'senat',
      });
    });
  });

  describe('getSejm AND getSenat', () => {
    const params: paramsDto = createParams({ is_deputy: false });
    let {
      o_num,
      sex,
      c_pos,
      l_num,
      proffesion,
      home,
      min_vote_num,
      max_vote_num,
      min_vote_percent,
      max_vote_percent,
      is_deputy,
    } = params;

    const defaultFilters: BaseFilter = {
      'Czy przyznano mandat': is_deputy ? 'Tak' : { $exists: true },
      'Nr okręgu': o_num ? { $in: o_num.split(',') } : { $exists: true },
      'Pozycja na liście': c_pos
        ? { $in: c_pos.split(',') }
        : { $exists: true },

      Płeć: { $in: sex.split(',') },
      Zawód: proffesion ? { $in: proffesion.split(',') } : { $exists: true },
      'Miejsce zamieszkania': home
        ? { $in: home.split(',') }
        : { $exists: true },
      'Liczba głosów': {
        $gte: min_vote_num ? min_vote_num : 0,
        $lte: max_vote_num ? max_vote_num : Number.MAX_SAFE_INTEGER,
      },
    };
    it('should return one sejm candidate with less than 0.2 vote %', async () => {
      const firstCandidate = createMockCandidate<Candidate>({
        'Procent głosów oddanych w okręgu': '0,15',
      });
      const secondCandidate = createMockCandidate<Candidate>({
        'Procent głosów oddanych w okręgu': '0,25',
      });
      const candidates: BaseCandidate[] = [firstCandidate, secondCandidate];

      jest.spyOn(candidateModel, 'find').mockResolvedValue(candidates);

      const filters: SejmFilter = {
        ...defaultFilters,
        ['Nr listy']: l_num ? { $in: l_num.split(',') } : { $exists: true },
      };

      min_vote_percent = 0.1;
      max_vote_percent = 0.2;

      const filteredCandidates = await service.getSejm(
        filters,
        min_vote_percent,
        max_vote_percent,
        min_vote_num,
        max_vote_num,
        l_num,
      );
      expect(candidateModel.find).toHaveBeenCalledWith(filters);
      expect(filteredCandidates).toHaveLength(1);
    });

    it('should return one senat candidate with less than 0.2 vote %', async () => {
      const firstCandidate = createMockCandidate<CandidateSenat>({
        'Procent głosów oddanych w okręgu': '0,15',
      });
      const secondCandidate = createMockCandidate<CandidateSenat>({
        'Procent głosów oddanych w okręgu': '0,25',
      });
      const candidates: BaseCandidate[] = [firstCandidate, secondCandidate];

      jest.spyOn(candidateSenatModel, 'find').mockResolvedValue(candidates);

      const filters: SenatFilter = {
        ...defaultFilters,
      };

      min_vote_percent = 0.1;
      max_vote_percent = 0.2;

      const filteredCandidates = await service.getSenat(
        filters,
        min_vote_percent,
        max_vote_percent,
        min_vote_num,
        max_vote_num,
      );
      expect(candidateSenatModel.find).toHaveBeenCalledWith(filters);
      expect(filteredCandidates).toHaveLength(1);
    });
  });

  describe('getCandidates', () => {
    const params: paramsDto = createParams({ is_deputy: false });
    let {
      o_num,
      sex,
      c_pos,
      l_num,
      proffesion,
      home,
      min_vote_num,
      max_vote_num,
      min_vote_percent,
      max_vote_percent,
      is_deputy,
    } = params;
    const defaultFilters: BaseFilter = {
      'Czy przyznano mandat': is_deputy ? 'Tak' : { $exists: true },
      'Nr okręgu': o_num ? { $in: o_num.split(',') } : { $exists: true },
      'Pozycja na liście': c_pos
        ? { $in: c_pos.split(',') }
        : { $exists: true },

      Płeć: { $in: sex.split(',') },
      Zawód: proffesion ? { $in: proffesion.split(',') } : { $exists: true },
      'Miejsce zamieszkania': home
        ? { $in: home.split(',') }
        : { $exists: true },
      'Liczba głosów': {
        $gte: min_vote_num ? min_vote_num : 0,
        $lte: max_vote_num ? max_vote_num : Number.MAX_SAFE_INTEGER,
      },
    };

    it('should return sejm candidate with less than 0.2% votes', async () => {
      const firstCandidate = createMockCandidate<Candidate>({
        'Procent głosów oddanych w okręgu': '0,15',
      });

      const candidates: BaseCandidate[] = [firstCandidate];
      jest.spyOn(service, 'getSejm').mockResolvedValue(candidates);
      const filteredCandidates = await service.getCandidates(params, 'sejm');
      expect(service.getSejm).toHaveBeenCalledWith(
        defaultFilters as SejmFilter,
        min_vote_percent,
        max_vote_percent,
        min_vote_num,
        max_vote_num,
        l_num,
      );
      expect(filteredCandidates).toHaveLength(1);
    });

    it('should return senat candidate with less than 0.2% votes', async () => {
      const firstCandidate = createMockCandidate<CandidateSenat>({
        'Procent głosów oddanych w okręgu': '0,15',
      });

      const candidates: BaseCandidate[] = [firstCandidate];
      jest.spyOn(service, 'getSenat').mockResolvedValue(candidates);
      const filteredCandidates = await service.getCandidates(params, 'senat');
      expect(service.getSenat).toHaveBeenCalledWith(
        defaultFilters as SenatFilter,
        min_vote_percent,
        max_vote_percent,
        min_vote_num,
        max_vote_num,
      );
      expect(filteredCandidates).toHaveLength(1);
    });
    it('should throw an error', async () => {
      const candidates: BaseCandidate[] = [];
      jest.spyOn(service, 'getSenat').mockResolvedValue(candidates);

      try {
        const filteredCandidates = await service.getCandidates(params, 'senat');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('No candidates found');
        expect(e.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });
});
