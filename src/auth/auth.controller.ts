import { Body, Controller, Post, Get, ForbiddenException } from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './dto/AccessTokenResponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: AccessTokenResponseDto
  })
  @ApiForbiddenResponse({
    description: 'User already exists.',
  })
  signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

  @ApiCreatedResponse({
    description: 'The access token has been successfully refreshed.',
    type: AccessTokenResponseDto
  })
  @ApiForbiddenResponse({
    description: 'User does not exist.',
  })
  @Post('get-new-token')
  getNewToken(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.getNewToken(dto);
  }
}
