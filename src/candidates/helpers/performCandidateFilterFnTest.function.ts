import { BaseCandidate } from 'src/schemas/BaseCandidate.schema';
import { createMockCandidate } from './createMockCandidate.function';
import { Candidate } from 'src/schemas/candidate.schema';
import { CandidateSenat } from 'src/schemas/CandidateSenat.schema';

export const performCandidateFilterFnTest = (inputObj: {
  filterFn: (
    candidates: BaseCandidate[],
    minFilter: number,
    maxFilter: number,
  ) => BaseCandidate[];
  minFilter: number;
  maxFilter: number;
  firstCandidateCreationOptions: {};
  secondCandidateCreationOptions: {};
  expectedLength: number;
  candidateType: string;
}): void => {
  const {
    candidateType,
    expectedLength,
    filterFn,
    minFilter,
    maxFilter,
    firstCandidateCreationOptions,
    secondCandidateCreationOptions,
  } = inputObj;

  let firstCandidate: BaseCandidate;
  let secondCandidate: BaseCandidate;
  if (candidateType === 'senat') {
    firstCandidate = createMockCandidate<CandidateSenat>(
      firstCandidateCreationOptions,
    );
    secondCandidate = createMockCandidate<CandidateSenat>(
      secondCandidateCreationOptions,
    );
  } else {
    firstCandidate = createMockCandidate<Candidate>(
      firstCandidateCreationOptions,
    );
    secondCandidate = createMockCandidate<Candidate>(
      secondCandidateCreationOptions,
    );
  }

  const candidates: BaseCandidate[] = [firstCandidate, secondCandidate];

  const filteredCandidates: BaseCandidate[] = filterFn(
    candidates,
    minFilter,
    maxFilter,
  );
  expect(filteredCandidates).toHaveLength(expectedLength);
};
