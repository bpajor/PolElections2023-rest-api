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
      option: ResultsOptions.OBWODY,
    });
  }

  @Get('wojewodztwa')
  getWojewodztwa(@Query() params: ExtendedResultsWojewodztwaDto) {
    return this.resultsService.getResults(params, {
      option: ResultsOptions.WOJEWODZTWA,
    });
  }

  @Get('powiaty')
  getPowiaty(@Query() params: ExtendedResultsPowiatyDto) {
    return this.resultsService.getResults(params, {
      option: ResultsOptions.POWIATY,
    });
  }

  @Get('gminy')
  getGminy(@Query() params: ExtendedResultsGminyDto) {
    return this.resultsService.getResults(params, {
      option: ResultsOptions.GMINY,
    });
  }
}
