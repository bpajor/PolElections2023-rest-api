import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('http://localhost:3000/candidates/sejm?is_deputy=true', 302)
  getHome(): void {}
}
