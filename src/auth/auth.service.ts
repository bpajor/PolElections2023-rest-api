import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  /**
   * Registers a new user and returns an access token.
   * Throws a ForbiddenException if the user already exists.
   * @param dto - The authentication data for the new user.
   * @returns A promise that resolves to an object containing the access token.
   */
  async signup(dto: AuthDto): Promise<{ access_token: string }> {
    try {
      const userExists = await this.userModel.exists({ email: dto.email });
      if (userExists) {
        throw new ForbiddenException('User already exists');
      }
      console.log('User does not exist');
      const user = new this.userModel(dto);
      console.log('user: ', user);
      await user.save();
      return this.signToken(dto.email, user._id.toString());
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new HttpException('Could not create user', 500);
    }
  }

  /**
   * Retrieves a new access token for an existing user.
   * @param dto - The authentication data for the user.
   * @returns A promise that resolves to an object containing the access token.
   */
  async getNewToken(dto: AuthDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      return await this.signToken(dto.email, user._id.toString());
    } catch (error) {
      throw new HttpException('Could not get new token', 500);
    }
  }

  /**
   * Signs a token with the provided email and user ID.
   * @param email - The email of the user.
   * @param uid - The ID of the user.
   * @returns A promise that resolves to an object containing the access token.
   */
  async signToken(
    email: string,
    uid: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = { sub: uid, email };
      const secret = this.config.get('JWT_SECRET');

      const token = await this.jwt.signAsync(payload, {
        expiresIn: '30d',
        secret,
      });

      return { access_token: token };
    } catch (error) {
      throw new HttpException('Could not sign token', 500);
    }
  }
}
