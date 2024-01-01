import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ResultsService } from './results.service';
import { ExtendedResultsOkregiDto } from '../results/dto/extended-results-okregi.dto';
import { ExtendedResultsWojewodztwaDto } from '../results/dto/extended-results-wojewodztwa.dto';
import { ResultsOptions } from '../enums/results-options.enum';
import { ExtendedResultsPowiatyDto } from '../results/dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from '../results/dto/extended-results-gminy.dto';
import { ExtendedResultsDto } from './types/types.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OkregiResult } from 'src/schemas/ResultsOkregi.schema';
import { Candidate } from 'src/schemas/candidate.schema';
import { CandidatesNotFoundDto } from 'src/candidates/dto/candidates-not-found.dto';
import { NoResultsFoundDto } from './dto/NoResultsFound.dto';
import { WojewodztwaResult } from 'src/schemas/WojewodztwaResults.schema';
import { PowiatyResult } from 'src/schemas/ResultsPowiaty.schema';
import { GminyResult } from 'src/schemas/GminyResult.schema';

@ApiTags('Results')
@UseGuards(JwtGuard)
@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  /**
   * Retrieves the results for okregi based on the provided query parameters.
   * @param params - The query parameters for filtering the results.
   * @returns The results for okregi.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The results have been successfully retrieved.',
    type: OkregiResult,
  })
  @ApiNotFoundResponse({
    description: 'No results found.',
    type: NoResultsFoundDto
  })
  @Get('okregi')
  getOkregi(@Query() params: ExtendedResultsOkregiDto) {
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.OKREGI,
    });
  }

  /**
   * Retrieves the results for wojewodztwa based on the provided query parameters.
   * @param params - The query parameters for filtering the results.
   * @returns The results for wojewodztwa.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The results have been successfully retrieved.',
    type: WojewodztwaResult,
  })
  @ApiNotFoundResponse({
    description: 'No results found.',
    type: NoResultsFoundDto
  })
  @Get('wojewodztwa')
  getWojewodztwa(@Query() params: ExtendedResultsWojewodztwaDto) {
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.WOJEWODZTWA,
    });
  }

  /**
   * Retrieves the results for powiaty based on the provided query parameters.
   * @param params - The query parameters for filtering the results.
   * @returns The results for powiaty.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The results have been successfully retrieved.',
    type: PowiatyResult,
  })
  @ApiNotFoundResponse({
    description: 'No results found.',
    type: NoResultsFoundDto
  })
  @Get('powiaty')
  getPowiaty(@Query() params: ExtendedResultsPowiatyDto) {
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.POWIATY,
    });
  }

  /**
   * Retrieves the results for gminy based on the provided query parameters.
   * @param params - The query parameters for filtering the results.
   * @returns The results for gminy.
   */
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The results have been successfully retrieved.',
    type: GminyResult,
  })
  @ApiNotFoundResponse({
    description: 'No results found.',
    type: NoResultsFoundDto
  })  
  @Get('gminy')
  getGminy(@Query() params: ExtendedResultsGminyDto) {
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.GMINY,
    });
  }
}
