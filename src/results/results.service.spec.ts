import { Test, TestingModule } from '@nestjs/testing';
import { ResultsService } from './results.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
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
import {
  GminyResult,
  GminyResultDocument,
  GminyResultSchema,
} from '../schemas/GminyResult.schema';
import { Model } from 'mongoose';
import { createResultsParams } from './helpers/createResultsParams.function';
import { ExtendedResultsOkregiDto } from './dto/extended-results-okregi.dto';
import { ResultsDto } from './dto/results.dto';
import { ExtendedResultsWojewodztwaDto } from './dto/extended-results-wojewodztwa.dto';
import { ExtendedResultsPowiatyDto } from './dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from './dto/extended-results-gminy.dto';
import { BaseResults, BaseResultsDocument } from '../schemas/BaseResult.schema';
import { ResultsOptions } from '../enums/results-options.enum';

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
    min_vote_perc: undefined,
    max_vote_perc: undefined,
  };

  const mockWojewodztwo: WojewodztwaResult = {
    Województwo: 'lubelskie',
    Frekwencja: '70,51',
    'Procent głosów nieważnych': '1,83',
    'KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY': '1,80',
    'KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE':
      '14,70',
    'KOMITET WYBORCZY NOWA LEWICA': '5,68',
    'KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ': '47,66',
    'KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ': '8,14',
    'KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N IPL ZIELONI':
      '19,11',
    'KOMITET WYBORCZY POLSKA JEST JEDNA': '2,52',
    'KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU': '0,40',
    'KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA': undefined,
    'KOMITET WYBORCZY NORMALNY KRAJ': undefined,
    'KOMITET WYBORCZY ANTYPARTIA': undefined,
    'KOMITET WYBORCZY RUCH NAPRAWY POLSKI': undefined,
  };

  const mockOkreg: OkregiResult = {
    'Nr okręgu': 1,
    Frekwencja: '71,45',
    'Procent głosów nieważnych': '1,95',
    'KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY': '3,34',
    'KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE':
      '10,75',
    'KOMITET WYBORCZY NOWA LEWICA': '9,51',
    'KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ': '34,80',
    'KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ': '6,33',
    'KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N IPL ZIELONI':
      '33,78',
    'KOMITET WYBORCZY POLSKA JEST JEDNA': '1,49',
    'KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA': undefined,
    'KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU': undefined,
    'KOMITET WYBORCZY NORMALNY KRAJ': undefined,
    'KOMITET WYBORCZY ANTYPARTIA': undefined,
    'KOMITET WYBORCZY RUCH NAPRAWY POLSKI': undefined,
  };

  const mockPowiat: PowiatyResult = {
    Powiat: 'ząbkowicki',
    Województwo: 'dolnośląskie',
    'Nr okręgu': 2,
    Frekwencja: '65,97',
    'Procent głosów nieważnych': '2,19',
    'KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY': '2,23',
    'KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE':
      '13,57',
    'KOMITET WYBORCZY NOWA LEWICA': '6,88',
    'KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ': '40,20',
    'KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ': '5,87',
    'KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N IPL ZIELONI':
      '29,90',
    'KOMITET WYBORCZY POLSKA JEST JEDNA': '1,35',
    'KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA': undefined,
    'KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU': undefined,
    'KOMITET WYBORCZY NORMALNY KRAJ': undefined,
    'KOMITET WYBORCZY ANTYPARTIA': undefined,
    'KOMITET WYBORCZY RUCH NAPRAWY POLSKI': undefined,
  };

  const mockGmina: GminyResult = {
    Gmina: 'Żegocina',
    Powiat: 'bocheński',
    Województwo: 'małopolskie',
    'Nr okręgu': 13,
    Frekwencja: '68,54',
    'Procent głosów nieważnych': '1,75',
    'KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY': '1,59',
    'KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE':
      '10,87',
    'KOMITET WYBORCZY NOWA LEWICA': '5,97',
    'KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ': '44,92',
    'KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ': '6,23',
    'KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N IPL ZIELONI':
      '25,92',
    'KOMITET WYBORCZY POLSKA JEST JEDNA': '2,05',
    'KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA': undefined,
    'KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU': undefined,
    'KOMITET WYBORCZY NORMALNY KRAJ': undefined,
    'KOMITET WYBORCZY ANTYPARTIA': undefined,
    'KOMITET WYBORCZY RUCH NAPRAWY POLSKI': undefined,
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
      jest.spyOn(okregiResultsModel, 'find').mockResolvedValue([mockOkreg]);
      const params: ExtendedResultsOkregiDto = { ...defaultParams, o_num: '1' };
      const result = await service.getOkregi(params, okregiResultsModel);

      expect(okregiResultsModel.find).toHaveBeenCalledWith({
        'Nr okręgu': {
          $in: ['1'],
        },
      });
      expect(result).toEqual([mockOkreg]);
    });
  });

  describe('getWojewodztwa', () => {
    it("should get 'woj' object", async () => {
      jest
        .spyOn(wojewodztwaResultsModel, 'find')
        .mockResolvedValue([mockWojewodztwo]);
      const params: ExtendedResultsWojewodztwaDto = {
        ...defaultParams,
        woj: 'lubelskie',
      };
      const result = await service.getWojewodztwa(
        params,
        wojewodztwaResultsModel,
      );

      expect(wojewodztwaResultsModel.find).toHaveBeenCalledWith({
        Województwo: {
          $in: ['lubelskie'],
        },
      });
      expect(result).toEqual([mockWojewodztwo]);
    });
  });

  describe('getPowiaty', () => {
    it("should get 'pow' object", async () => {
      jest.spyOn(powiatyResultsModel, 'find').mockResolvedValue([mockPowiat]);
      const params: ExtendedResultsPowiatyDto = {
        ...defaultParams,
        pow: 'ząbkowicki',
      };
      const result = await service.getPowiaty(params, powiatyResultsModel);

      expect(powiatyResultsModel.find).toHaveBeenCalledWith({
        Powiat: {
          $in: ['ząbkowicki'],
        },
      });
      expect(result).toEqual([mockPowiat]);
    });
  });

  describe('getGminy', () => {
    it("should get 'gmina' object", async () => {
      jest.spyOn(gminyResultsModel, 'find').mockResolvedValue([mockGmina]);
      const params: ExtendedResultsGminyDto = {
        ...defaultParams,
        gmina: 'Żegocina',
        woj: undefined,
        pow: undefined,
        o_num: undefined,
      };
      const result = await service.getGminy(params, gminyResultsModel);

      expect(gminyResultsModel.find).toHaveBeenCalledWith({
        Gmina: {
          $in: [new RegExp('Żegocina', 'i')],
        },
      });
      expect(result).toEqual([mockGmina]);
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
    it('should return the same object if no min and max attendance percent is provided', () => {
      const secondOkreg: OkregiResult = { ...firstOkreg, Frekwencja: '40' };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = { ...defaultParams };
      const result = service.filterByMinAndMaxVoteAttendancePerc(
        params.min_attendance_percent,
        params.max_attendance_percent,
        input as BaseResults[],
      );
      expect(result).toEqual(input);
    });
    it('should return the only one object with 70% attendance if min attendance percent is provided but no max attendance percent is provided', () => {
      const secondOkreg: OkregiResult = { ...firstOkreg, Frekwencja: '40' };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_attendance_percent: 70,
      };
      const result = service.filterByMinAndMaxVoteAttendancePerc(
        params.min_attendance_percent,
        params.max_attendance_percent,
        input as BaseResults[],
      );
      expect(result).toEqual([firstOkreg]);
    });
    it('should return the only one object with 40% attendance if max attendance percent is provided but no min attendance percent is provided', () => {
      console.log('frekwencja: ', Number(firstOkreg.Frekwencja));
      console.log('First okręg: ', firstOkreg);
      const secondOkreg: OkregiResult = { ...firstOkreg, Frekwencja: '40' };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        max_attendance_percent: 40,
      };
      const result = service.filterByMinAndMaxVoteAttendancePerc(
        params.min_attendance_percent,
        params.max_attendance_percent,
        input as BaseResults[],
      );
      expect(result).toEqual([secondOkreg]);
    });
    it('should return empty array', () => {
      const secondOkreg: OkregiResult = { ...firstOkreg, Frekwencja: '40' };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_attendance_percent: 15,
        max_attendance_percent: 30,
      };
      const result = service.filterByMinAndMaxVoteAttendancePerc(
        params.min_attendance_percent,
        params.max_attendance_percent,
        input as BaseResults[],
      );
      expect(result).toEqual([]);
    });
    it('should throw an error if attendance percent is not a number', () => {
      const secondOkreg: OkregiResult = { ...firstOkreg, Frekwencja: '40' };
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
    it('should return the same object if no min and max invalid votes percent is provided', () => {
      const secondOkreg: OkregiResult = {
        ...firstOkreg,
        'Procent głosów nieważnych': '40',
      };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = { ...defaultParams };
      const result = service.filterByMinAndMaxInvalidVotesPerc(
        params.min_invalid_votes_percent,
        params.max_invalid_votes_percent,
        input as BaseResults[],
      );
      expect(result).toEqual(input);
    });
    it('should return the only one object with 40% invalid votes if min invalid votes percent is provided but no max invalid votes percent is provided', () => {
      const secondOkreg: OkregiResult = {
        ...firstOkreg,
        'Procent głosów nieważnych': '40',
      };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        min_invalid_votes_percent: 3,
      };
      const result = service.filterByMinAndMaxInvalidVotesPerc(
        params.min_invalid_votes_percent,
        params.max_invalid_votes_percent,
        input as BaseResults[],
      );
      expect(result).toEqual([secondOkreg]);
    });
    it('should return the only one object with 1.95% invalid votes if max invalid votes percent is provided but no min invalid votes percent is provided', () => {
      const secondOkreg: OkregiResult = {
        ...firstOkreg,
        'Procent głosów nieważnych': '40',
      };
      const input: OkregiResult[] = [firstOkreg, secondOkreg];
      const params: ResultsDto = {
        ...defaultParams,
        max_invalid_votes_percent: 30,
      };
      const result = service.filterByMinAndMaxInvalidVotesPerc(
        params.min_invalid_votes_percent,
        params.max_invalid_votes_percent,
        input as BaseResults[],
      );
      expect(result).toEqual([firstOkreg]);
    });
    it('should return empty array', () => {
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
      const result = service.filterByMinAndMaxInvalidVotesPerc(
        params.min_invalid_votes_percent,
        params.max_invalid_votes_percent,
        input as BaseResults[],
      );
      expect(result).toEqual([]);
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
