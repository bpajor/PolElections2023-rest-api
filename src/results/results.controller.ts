import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ResultsService } from './results.service';
import { ExtendedResultsOkregiDto } from '../results/dto/extended-results-okregi.dto';
import { ExtendedResultsWojewodztwaDto } from '../results/dto/extended-results-wojewodztwa.dto';
import { ResultsOptions } from '../enums/results-options.enum';
import { ExtendedResultsPowiatyDto } from '../results/dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from '../results/dto/extended-results-gminy.dto';
import { ExtendedResultsDto } from './types/types.dto';

@UseGuards(JwtGuard)
@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  /**
   * Retrieves the results for okregi based on the provided query parameters.
   * @param params - The query parameters for filtering the results.
   * @returns The results for okregi.
   */
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
  @Get('gminy')
  getGminy(@Query() params: ExtendedResultsGminyDto) {
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.GMINY,
    });
  }
}
