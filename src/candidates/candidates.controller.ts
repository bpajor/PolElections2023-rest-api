import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { paramsDto } from './dto';
import { CandidatesService } from './candidates.service';
import { Candidate } from '../schemas/candidate.schema';
import { CandidateSenat } from '../schemas/CandidateSenat.schema';
import { BaseCandidate } from 'src/schemas/BaseCandidate.schema';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CandidatesNotFoundDto } from './dto/candidates-not-found.dto';

@ApiTags('Candidates')
@UseGuards(JwtGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private candidateService: CandidatesService) {}

  /**
   * Get candidates for the Sejm.
   * @param params - The query parameters.
   * @returns A promise that resolves to an array of Candidate objects.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The candidates have been successfully retrieved.',
    type: Candidate,
  })
  @ApiNotFoundResponse({
    description: 'No candidates found.',
    type: CandidatesNotFoundDto
  })
  @Get('/sejm')
  getSejm(@Query() params: paramsDto): Promise<BaseCandidate[]> {
    console.log('params in controller', params);
    return this.candidateService.getCandidates(params, 'sejm');
  }

  /**
   * Get candidates for the Senat.
   * @param params - The query parameters.
   * @returns A promise that resolves to an array of CandidateSenat objects.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The candidates have been successfully retrieved.',
    type: CandidateSenat,
  })
  @ApiNotFoundResponse({
    description: 'No candidates found.',
    type: CandidatesNotFoundDto
  })
  @Get('/senat')
  getSenat(@Query() params: paramsDto): Promise<BaseCandidate[]> {
    return this.candidateService.getCandidates(params, 'senat');
  }
}
