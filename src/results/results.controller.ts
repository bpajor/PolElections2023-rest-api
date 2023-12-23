import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ResultsService } from './results.service';
import { ExtendedResultsOkregiDto } from 'src/results/dto/extended-results-okregi.dto';
import { ExtendedResultsWojewodztwaDto } from 'src/results/dto/extended-results-wojewodztwa.dto';
import { ResultsOptions } from 'src/enums/results-options.enum';
import { ExtendedResultsPowiatyDto } from 'src/results/dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from 'src/results/dto/extended-results-gminy.dto';

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
    console.log('here');
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
    let filterLayer: ResultsOptions;
    if ('pow' in params) {
      filterLayer = ResultsOptions.POWIATY;
    } else if ('woj' in params) {
      filterLayer = ResultsOptions.WOJEWODZTWA;
    } else {
      filterLayer = ResultsOptions.OKREGI;
    }
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.POWIATY,
      filterLayer,
    });
  }

  /**
   * Retrieves the results for gminy based on the provided query parameters.
   * @param params - The query parameters for filtering the results.
   * @returns The results for gminy.
   */
  @Get('gminy')
  getGminy(@Query() params: ExtendedResultsGminyDto) {
    let filterLayer: ResultsOptions;
    if ('gmina' in params) {
      filterLayer = ResultsOptions.GMINY;
    } else if ('pow' in params) {
      filterLayer = ResultsOptions.POWIATY;
    } else if ('woj' in params) {
      filterLayer = ResultsOptions.WOJEWODZTWA;
    } else {
      filterLayer = ResultsOptions.OKREGI;
    }
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.GMINY,
      filterLayer,
    });
  }
}
