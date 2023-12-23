import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { paramsDto } from './dto';
import { CandidatesService } from './candidates.service';
import { Candidate } from 'src/schemas/candidate.schema';
import { CandidateSenat } from 'src/schemas/CandidateSenat.schema';

@UseGuards(JwtGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private candidateService: CandidatesService) {}

  /**
   * Get candidates for the Sejm.
   * @param params - The query parameters.
   * @returns A promise that resolves to an array of Candidate objects.
   */
  @Get('/sejm')
  getTest(@Query() params: paramsDto): Promise<Candidate[]> {
    return this.candidateService.getCandidates(params, 'sejm');
  }

  /**
   * Get candidates for the Senat.
   * @param params - The query parameters.
   * @returns A promise that resolves to an array of CandidateSenat objects.
   */
  @Get('/senat')
  getSenat(@Query() params: paramsDto): Promise<CandidateSenat[]> {
    return this.candidateService.getCandidates(params, 'senat');
  }
}
