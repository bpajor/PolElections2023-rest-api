import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiFoundResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @ApiTags('Home')
  @ApiFoundResponse({
    description: 'Redirects to /candidates/sejm?is_deputy=true',
    type: String
  })
  @Get()
  @Redirect('candidates/sejm?is_deputy=true', 302)
  getHome(): void {}
}
