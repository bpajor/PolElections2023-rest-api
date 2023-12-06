import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { User } from 'src/schemas/user.schema';
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

  async signup(dto: AuthDto): Promise<{ access_token: string }> {
    const userExists = await this.userModel.exists({ email: dto.email });
    if (userExists) {
      throw new ForbiddenException('User already exists');
    }
    const user = new this.userModel(dto);
    await user.save();
    return this.signToken(dto.email, user._id.toString());
  }

  async getNewToken(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email: dto.email });
    return this.signToken(dto.email, user._id.toString());
  }

  async signToken(
    email: string,
    uid: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: uid, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret,
    });

    return { access_token: token };
  }
}
