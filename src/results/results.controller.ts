import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ResultsService } from './results.service';
import { ExtendedResultsObwodyDto } from 'src/candidates/dto/extended-results-obwody.dto';
import { ExtendedResultsWojewodztwaDto } from 'src/candidates/dto/extended-results-wojewodztwa.dto';
import { ResultsOptions } from 'src/enums/results-options.enum';
import { ExtendedResultsPowiatyDto } from 'src/candidates/dto/extended-results-powiaty.dto';
import { ExtendedResultsGminyDto } from 'src/candidates/dto/extended-results-gminy.dto';

@UseGuards(JwtGuard)
@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get('obwody')
  getObwody(@Query() params: ExtendedResultsObwodyDto) {
    console.log('here');
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.OBWODY,
    });
  }

  @Get('wojewodztwa')
  getWojewodztwa(@Query() params: ExtendedResultsWojewodztwaDto) {
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.WOJEWODZTWA,
    });
  }

  @Get('powiaty')
  getPowiaty(@Query() params: ExtendedResultsPowiatyDto) {
    let filterLayer: ResultsOptions;
    if ('pow' in params) {
      filterLayer = ResultsOptions.POWIATY;
    } else if ('woj' in params) {
      filterLayer = ResultsOptions.WOJEWODZTWA;
    } else {
      filterLayer = ResultsOptions.OBWODY;
    }
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.POWIATY,
      filterLayer,
    });
  }

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
      filterLayer = ResultsOptions.OBWODY;
    }
    return this.resultsService.getResults(params, {
      resultsLayer: ResultsOptions.GMINY,
      filterLayer,
    });
  }
}
