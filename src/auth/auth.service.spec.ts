import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { config } from 'process';
import { AuthDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwt: JwtService;
  let config: ConfigService;

  let userModel: Model<User>;

  let mockJwtService = { signAsync: jest.fn() };
  let mockUserModel = {
    exists: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signToken', () => {
    it('should sign a token', async () => {
      const email = 'test@test.com';
      const uid = '1234567890';
      const secret = config.get('JWT_SECRET');
      const preparedToken = process.env.PREPARED_TOKEN;
      jest.spyOn(jwt, 'signAsync').mockResolvedValue(preparedToken);
      const token = await service.signToken(email, uid);
      expect(jwt.signAsync).toHaveBeenCalledWith(
        { sub: uid, email: email },
        { expiresIn: '30d' },
      );
      expect(token).toEqual({ access_token: preparedToken });
    });

    it('should throw an error if the token could not be signed', async () => {
      const email = 'test@test.com';
      const uid = '1234567890';
      jest.spyOn(jwt, 'signAsync').mockRejectedValue(new Error());
      try {
        const token = await service.signToken(email, uid);
      } catch (e) {
        expect(e.message).toEqual('Could not sign token');
      }
    });
  });

  describe('getNewToken', () => {
    it('should get a new token', async () => {
      const email = 'test@test.com';
      const uid = '1234567890';
      const user = { _id: uid, email };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(service, 'signToken').mockResolvedValue({ access_token: '' });
      const token = await service.getNewToken({ email });
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(token).toEqual({ access_token: '' });
    });

    it('should throw an error if the token could not be signed', async () => {
      const email = 'test@test.com';
      const uid = '1234567890';
      const user = { _id: uid, email };
      jest.spyOn(userModel, 'findOne').mockResolvedValue({});
      jest.spyOn(service, 'signToken').mockRejectedValue({ access_token: '' });
      try {
        const token = await service.getNewToken({ email });
      } catch (e) {
        expect(e.message).toEqual('Could not get new token');
      }
    });
  });

  //TODO: Implement signup tests
  describe('signup', () => {});
});
