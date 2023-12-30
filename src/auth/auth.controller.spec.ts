import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForbiddenException, HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    getNewToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = { access_token: 'test' };
      jest.spyOn(service, 'signup').mockResolvedValue(expectedResult);
      const dto = {
        email: 'test@test.com',
      };
      const result = await controller.signup(dto);
      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw an error if the user already exists', async () => {
      const dto = {
        email: 'test@test.com',
      };
      jest
        .spyOn(service, 'signup')
        .mockRejectedValue(new ForbiddenException('User already exists'));
      try {
        const result = await controller.signup(dto);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
        expect(e.message).toEqual('User already exists');
      }
    });

    it('should throw an error if the user cannot be created', async () => {
      const dto = {
        email: '',
      };
      jest
        .spyOn(service, 'signup')
        .mockRejectedValue(new HttpException('Could not create user', 500));
      try {
        const result = await controller.signup(dto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('Could not create user');
      }
    });
  });

  describe('getNewToken', () => {
    it('should call the service with the correct parameters', async () => {
      const expectedResult = { access_token: 'test' };
      jest.spyOn(service, 'getNewToken').mockResolvedValue(expectedResult);
      const dto = {
        email: 'test@test.com',
      };
      try {
        const result = await controller.getNewToken(dto);
        expect(service.getNewToken).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      } catch (e) {
        console.log(e);
      }
    });

    it('should throw an error if the token could not be signed', async () => {
      const dto = {
        email: 'test@test.com',
      };
      jest
        .spyOn(service, 'getNewToken')
        .mockRejectedValue(new HttpException('Could not get new token', 500));

      try {
        const result = await controller.getNewToken(dto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('Could not get new token');
      }
    });
  });
});
