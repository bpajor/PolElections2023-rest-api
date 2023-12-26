import { ResultsDto } from '../dto/results.dto';

export const createResultsParams = (overrides: {}) => {
  const defaultParams: ResultsDto = {
    max_attendance_percent: undefined,
    min_attendance_percent: undefined,
    max_invalid_votes_percent: undefined,
    min_invalid_votes_percent: undefined,
    min_vote_perc: undefined,
    max_vote_perc: undefined,
  };
  return { ...defaultParams, ...overrides };
};
