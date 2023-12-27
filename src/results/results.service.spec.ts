import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { getModelToken } from '@nestjs/mongoose';
import { OkregiResult } from '../schemas/ResultsOkregi.schema';
import { WojewodztwaResult } from '../schemas/WojewodztwaResults.schema';
import { PowiatyResult } from '../schemas/ResultsPowiaty.schema';
import { GminyResult } from '../schemas/GminyResult.schema';
import { Model } from 'mongoose';
import { ExtendedResultsOkregiDto } from './dto/extended-results-okregi.dto';
import { ResultsDto } from './dto/results.dto';
import { ExtendedResultsWojewodztwaDto } from './dto/extended-results-wojewodztwa.dto';
import { ExtendedResultsPowiatyDto } from './dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from './dto/extended-results-gminy.dto';
import { BaseResults } from '../schemas/BaseResult.schema';
import { ResultsOptions } from '../enums/results-options.enum';
import {
  mockGmina,
  mockOkreg,
  mockPowiat,
  mockWojewodztwo,
} from './constants/mockResults.constants';
import { create } from 'domain';
import { performGetByDistrictTest } from './helpers/performGetByDistrictTest.function';
import { performFilterFnTest } from './helpers/perfromFilterFnTest.function';

describe('ResultsService', () => {
  let service: ResultsService;

  let okregiResultsModel: Model<OkregiResult>;
  let wojewodztwaResultsModel: Model<WojewodztwaResult>;
  let powiatyResultsModel: Model<PowiatyResult>;
  let gminyResultsModel: Model<GminyResult>;

  const mockResultsService = { find: jest.fn(), getOkregi: jest.fn() };
  const defaultParams: ResultsDto = {
    max_attendance_percent: undefined,
    min_attendance_percent: undefined,
    max_invalid_votes_percent: undefined,
    min_invalid_votes_percent: undefined,
    // min_vote_perc: undefined,
    // max_vote_perc: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        {
          provide: getModelToken(OkregiResult.name),
          useValue: mockResultsService,
        },
        {
          provide: getModelToken(WojewodztwaResult.name),
          useValue: mockResultsService,
        },
        {
          provide: getModelToken(PowiatyResult.name),
          useValue: mockResultsService,
        },
        {
          provide: getModelToken(GminyResult.name),
          useValue: mockResultsService,
        },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
    okregiResultsModel = module.get<Model<OkregiResult>>(
      getModelToken(OkregiResult.name),
    );
    wojewodztwaResultsModel = module.get<Model<WojewodztwaResult>>(
      getModelToken(WojewodztwaResult.name),
    );
    powiatyResultsModel = module.get<Model<PowiatyResult>>(
      getModelToken(PowiatyResult.name),
    );
    gminyResultsModel = module.get<Model<GminyResult>>(
      getModelToken(GminyResult.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOkregi', () => {
    it("should get 'okreg' object", async () => {
      await performGetByDistrictTest<OkregiResult, ExtendedResultsOkregiDto>(
        okregiResultsModel,
        mockOkreg,
        { ...defaultParams, o_num: '1' },
        service.getOkregi,
        { 'Nr okręgu': { $in: ['1'] } },
      );
    });
  });

  describe('getWojewodztwa', () => {
    it("should get 'woj' object", async () => {
      await performGetByDistrictTest<
        WojewodztwaResult,
        ExtendedResultsWojewodztwaDto
      >(
        wojewodztwaResultsModel,
        mockOkreg,
        { ...defaultParams, woj: 'lubelskie' },
        service.getWojewodztwa,
        {
          Województwo: {
            $in: ['lubelskie'],
          },
        },
      );
    });
  });

  describe('getPowiaty', () => {
    it("should get 'pow' object", async () => {
      await performGetByDistrictTest<PowiatyResult, ExtendedResultsPowiatyDto>(
        powiatyResultsModel,
        mockPowiat,
        { ...defaultParams, pow: 'ząbkowicki' },
        service.getPowiaty,
        {
          Powiat: {
            $in: ['ząbkowicki'],
          },
        },
      );
    });
  });

  describe('getGminy', () => {
    it("should get 'gmina' object", async () => {
      await performGetByDistrictTest<GminyResult, ExtendedResultsGminyDto>(
        gminyResultsModel,
        mockGmina,
        { ...defaultParams, gmina: 'Żegocina' },
        service.getGminy,
        {
          Gmina: {
            $in: [new RegExp('Żegocina', 'i')],
          },
        },
      );
    });
  });

  describe('removeChars', () => {
    it('should remove all chars like m. and gm. from the gminy object', () => {
      const inputGmina: GminyResult[] = [
        { ...mockGmina, Gmina: 'gm. Żegocina' },
      ];
      const expectedGmina = { ...mockGmina };
      const result = service.removeChars(inputGmina);

      expect(result).toEqual([expectedGmina]);
    });
  });

  describe('filterByMinAndMaxVoteAttendancePerc', () => {
    const firstOkreg: OkregiResult = { ...mockOkreg };
    const secondOkreg: OkregiResult = { ...firstOkreg, Frekwencja: '40' };
    it('should return the same object if no min and max attendance percent is provided', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: undefined,
        max_filter: undefined,
        filterFn: service.filterByMinAndMaxVoteAttendancePerc,
        expectedOutput: [firstOkreg, secondOkreg],
      });
    });
    it('should return the only one object with 70% attendance if min attendance percent is provided but no max attendance percent is provided', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: 70,
        max_filter: undefined,
        filterFn: service.filterByMinAndMaxVoteAttendancePerc,
        expectedOutput: [firstOkreg],
      });
    });
    it('should return the only one object with 40% attendance if max attendance percent is provided but no min attendance percent is provided', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: undefined,
        max_filter: 40,
        filterFn: service.filterByMinAndMaxVoteAttendancePerc,
        expectedOutput: [secondOkreg],
      });
    });
    it('should return empty array', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: 15,
        max_filter: 30,
        filterFn: service.filterByMinAndMaxVoteAttendancePerc,
        expectedOutput: [],
      });
    });
    it('should throw an error if attendance percent is not a number', () => {
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_attendance_percent: 15,
        max_attendance_percent: 30,
      };
      input[0].Frekwencja = 'abc';
      expect(() =>
        service.filterByMinAndMaxVoteAttendancePerc(
          params.min_attendance_percent,
          params.max_attendance_percent,
          input as BaseResults[],
        ),
      ).toThrow(/Invalid attendance value:/);
    });
  });

  describe('filterByMinAndMaxInvalidVotesPerc', () => {
    const firstOkreg: OkregiResult = { ...mockOkreg };
    const secondOkreg: OkregiResult = {
      ...firstOkreg,
      'Procent głosów nieważnych': '40',
    };
    it('should return the same object if no min and max invalid votes percent is provided', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: undefined,
        max_filter: undefined,
        filterFn: service.filterByMinAndMaxInvalidVotesPerc,
        expectedOutput: [firstOkreg, secondOkreg],
      });
    });
    it('should return the only one object with 40% invalid votes if min invalid votes percent is provided but no max invalid votes percent is provided', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: 3,
        max_filter: undefined,
        filterFn: service.filterByMinAndMaxInvalidVotesPerc,
        expectedOutput: [secondOkreg],
      });
    });
    it('should return the only one object with 1.95% invalid votes if max invalid votes percent is provided but no min invalid votes percent is provided', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: undefined,
        max_filter: 30,
        filterFn: service.filterByMinAndMaxInvalidVotesPerc,
        expectedOutput: [firstOkreg],
      });
    });
    it('should return empty array', () => {
      performFilterFnTest({
        input: [firstOkreg, secondOkreg],
        min_filter: 15,
        max_filter: 30,
        filterFn: service.filterByMinAndMaxInvalidVotesPerc,
        expectedOutput: [],
      });
    });
    it('should throw an error if invalid votes percent is not a number', () => {
      const secondOkreg: OkregiResult = {
        ...firstOkreg,
        'Procent głosów nieważnych': '40',
      };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_invalid_votes_percent: 15,
        max_invalid_votes_percent: 30,
      };
      input[0]['Procent głosów nieważnych'] = 'abc';
      expect(() =>
        service.filterByMinAndMaxInvalidVotesPerc(
          params.min_invalid_votes_percent,
          params.max_invalid_votes_percent,
          input as BaseResults[],
        ),
      ).toThrow(/Invalid votes percent value:/);
    });
  });

  describe('filterAll', () => {
    it('should filter all results', () => {
      const firstOkreg = { ...mockOkreg };
      const secondOkreg = { ...mockOkreg, Frekwencja: '40' };
      const thirdOkreg = { ...mockOkreg, 'Procent głosów nieważnych': '3' };
      const input: BaseResults[] = [firstOkreg, secondOkreg, thirdOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_attendance_percent: 70,
        max_attendance_percent: 80,
        min_invalid_votes_percent: 1,
        max_invalid_votes_percent: 2,
      };
      const result = service.filterAll(
        params as ExtendedResultsOkregiDto,
        input,
      );

      expect(result).toEqual([firstOkreg]);
    });
  });

  describe('getResults', () => {
    it('should return first element of the input', async () => {
      const firstOkreg: BaseResults = { ...mockOkreg };
      const secondOkreg = { ...mockOkreg, Frekwencja: '40' };
      const thirdOkreg = { ...mockOkreg, 'Procent głosów nieważnych': '3' };
      const input: BaseResults[] = [firstOkreg, secondOkreg, thirdOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_attendance_percent: 70,
        max_attendance_percent: 80,
        min_invalid_votes_percent: 1,
        max_invalid_votes_percent: 2,
      };
      jest.spyOn(service, 'getOkregi').mockResolvedValue(input);
      const result = await service.getResults(
        params as ExtendedResultsOkregiDto,
        {
          resultsLayer: ResultsOptions.OKREGI,
        },
      );
      expect(result).toEqual([firstOkreg]);
    });

    it('should return 404', async () => {
      const firstOkreg: BaseResults = { ...mockOkreg };
      jest.spyOn(service, 'getOkregi').mockResolvedValue([]);
      expect(() => {
        try {
          service.getResults(defaultParams as ExtendedResultsOkregiDto, {
            resultsLayer: ResultsOptions.OKREGI,
          });
        } catch (e) {
          expect(e.status).toEqual(404);
          expect(e.message).toEqual(
            /No results match the provided parameters:/,
          );
        }
      });
    });
  });
});

//TODO - make code review
