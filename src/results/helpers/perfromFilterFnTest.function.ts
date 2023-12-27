import { OkregiResult } from 'src/schemas/ResultsOkregi.schema';
import { ResultsDto } from '../dto/results.dto';
import { BaseResults } from 'src/schemas/BaseResult.schema';

export const performFilterFnTest = (inputObj: {
  input: OkregiResult[];
  min_filter: number;
  max_filter: number;
  filterFn: (
    min_filter: number,
    max_filter: number,
    input: BaseResults[],
  ) => BaseResults[];
  expectedOutput: BaseResults[];
}): void => {
  const { input, filterFn, expectedOutput, min_filter, max_filter } = inputObj;

  const result = filterFn(min_filter, max_filter, input);

  console.log('result: ', result);
  console.log('expectedOutput: ', expectedOutput);
  expect(result).toEqual(expectedOutput);
};
