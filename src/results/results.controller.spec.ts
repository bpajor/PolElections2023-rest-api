import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { OkregiResult } from '../schemas/ResultsOkregi.schema';
import { WojewodztwaResult } from '../schemas/WojewodztwaResults.schema';
import { PowiatyResult } from '../schemas/ResultsPowiaty.schema';
import { GminyResult } from '../schemas/GminyResult.schema';
import { ResultsDto } from './dto/results.dto';
import { ExtendedResultsOkregiDto } from './dto/extended-results-okregi.dto';
import { createMockResult } from './helpers/createMockResult.function';
import { ExtendedResultsWojewodztwaDto } from './dto/extended-results-wojewodztwa.dto';
import { ExtendedResultsPowiatyDto } from './dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from './dto/extended-results-gminy.dto';

describe('ResultsController', () => {
  let controller: ResultsController;
  let service: ResultsService;

  const defaultParams: ResultsDto = {
    max_attendance_percent: undefined,
    min_attendance_percent: undefined,
    max_invalid_votes_percent: undefined,
    min_invalid_votes_percent: undefined,
  };

  const mockResultService = {
    getResults: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      providers: [{ provide: ResultsService, useValue: mockResultService }],
    }).compile();

    controller = module.get<ResultsController>(ResultsController);
    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOkregi', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = [
        createMockResult<OkregiResult>({ 'Nr okręgu': 1 }),
      ];
      jest.spyOn(service, 'getResults').mockResolvedValue(expectedResult);
      const params: ExtendedResultsOkregiDto = {
        ...defaultParams,
        o_num: '1',
      };
      const result = await controller.getOkregi(params);
      expect(service.getResults).toHaveBeenCalledWith(params, {
        resultsLayer: 'okregi',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getWojewodztwa', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = [
        createMockResult<WojewodztwaResult>({ Województwo: 'małopolskie' }),
      ];
      jest.spyOn(service, 'getResults').mockResolvedValue(expectedResult);
      const params: ExtendedResultsWojewodztwaDto = {
        ...defaultParams,
        woj: 'małopolskie',
      };
      const result = await controller.getWojewodztwa(params);
      expect(service.getResults).toHaveBeenCalledWith(params, {
        resultsLayer: 'województwa',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getPowiaty', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = [
        createMockResult<PowiatyResult>({ Powiat: 'bocheński' }),
      ];
      jest.spyOn(service, 'getResults').mockResolvedValue(expectedResult);
      const params: ExtendedResultsPowiatyDto = {
        ...defaultParams,
        pow: 'bocheński',
      };
      const result = await controller.getPowiaty(params);
      expect(service.getResults).toHaveBeenCalledWith(params, {
        resultsLayer: 'powiaty',
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGminy', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = [
        createMockResult<GminyResult>({ Gmina: 'Żegocina' }),
      ];
      jest.spyOn(service, 'getResults').mockResolvedValue(expectedResult);
      const params: ExtendedResultsGminyDto = {
        ...defaultParams,
        o_num: undefined,
        woj: undefined,
        pow: undefined,
        gmina: 'Żegocina',
      };
      const result = await controller.getGminy(params);
      expect(service.getResults).toHaveBeenCalledWith(params, {
        resultsLayer: 'gminy',
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
