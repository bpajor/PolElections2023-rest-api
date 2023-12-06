import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

  @Get('get-new-token')
  getNewToken(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.getNewToken(dto);
  }
}
