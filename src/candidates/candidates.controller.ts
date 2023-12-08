import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { paramsDto } from './dto';
import { CandidatesService } from './candidates.service';
import { Candidate } from 'src/schemas/candidate.schema';

@UseGuards(JwtGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private candidateService: CandidatesService) {}

  @Get('/get')
  getTest(@Query() params: paramsDto): Promise<Candidate[]> {
    return this.candidateService.getCandidates(params);
  }
}
