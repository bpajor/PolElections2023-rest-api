import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { paramsDto } from './dto';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  const defaultParams: paramsDto = {
    o_num: undefined,
    c_pos: undefined,
    is_deputy: false,
    l_num: undefined,
    home: undefined,
    proffesion: undefined,
    sex: undefined,
    max_vote_num: undefined,
    min_vote_num: undefined,
    max_vote_percent: undefined,
    min_vote_percent: undefined,
  };

  const mockCandidateService = {
    getCandidates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        { provide: CandidatesService, useValue: mockCandidateService },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSejm', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = [];
      jest.spyOn(service, 'getCandidates').mockResolvedValue(expectedResult);
      const params: paramsDto = {
        ...defaultParams,
        is_deputy: true,
      };
      const result = await controller.getSejm(params);
      expect(service.getCandidates).toHaveBeenCalledWith(params, 'sejm');
      expect(result).toEqual(expectedResult);
    });

    it('should call the service with the correct parameters', async () => {
      const expectedResult = [];
      jest.spyOn(service, 'getCandidates').mockResolvedValue(expectedResult);
      const params: paramsDto = {
        ...defaultParams,
        is_deputy: false,
      };
      const result = await controller.getSenat(params);
      expect(service.getCandidates).toHaveBeenCalledWith(params, 'senat');
      expect(result).toEqual(expectedResult);
    });
  });
});
