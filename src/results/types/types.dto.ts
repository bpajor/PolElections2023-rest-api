import { ExtendedResultsOkregiDto } from 'src/results/dto/extended-results-okregi.dto';
import { ExtendedResultsPowiatyDto } from 'src/results/dto/extended-results-powiaty.dto';
import { ExtendedResultsWojewodztwaDto } from 'src/results/dto/extended-results-wojewodztwa.dto';
import { ResultsDto } from 'src/results/dto/results.dto';

export type ExtendedResultsDto = ResultsDto &
  (
    | ExtendedResultsOkregiDto
    | ExtendedResultsWojewodztwaDto
    | ExtendedResultsPowiatyDto
  );
