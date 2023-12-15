import { ExtendedResultsObwodyDto } from 'src/candidates/dto/extended-results-obwody.dto';
import { ExtendedResultsPowiatyDto } from 'src/candidates/dto/extended-results-powiaty.dto';
import { ExtendedResultsWojewodztwaDto } from 'src/candidates/dto/extended-results-wojewodztwa.dto';
import { ResultsDto } from 'src/candidates/dto/results.dto';

export type ExtendedResultsDto = ResultsDto &
  (
    | ExtendedResultsObwodyDto
    | ExtendedResultsWojewodztwaDto
    | ExtendedResultsPowiatyDto
  );
