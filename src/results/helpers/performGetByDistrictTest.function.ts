import { Model } from 'mongoose';
import { BaseResults } from 'src/schemas/BaseResult.schema';
import { ResultsDto } from '../dto/results.dto';

/**
 * Performs a test for getting results by district.
 *
 * @template T - The type of the model.
 * @template P - The type of the parameters.
 * @param {Model<T>} model - The Mongoose model.
 * @param {Partial<T>} mockValue - The mock value.
 * @param {Partial<P>} params - The parameters.
 * @param {(params: Partial<P>, model: Model<T>) => Promise<BaseResults[]>} resultFn - The function to retrieve results.
 * @param {Object} filter - The filter object.
 * @returns {Promise<void>} - A promise that resolves when the test is complete.
 */
export const performGetByDistrictTest = async <
  T extends BaseResults,
  P extends ResultsDto,
>(
  model: Model<T>,
  mockValue: Partial<T>,
  params: Partial<P>,
  resultFn: (params: Partial<P>, model: Model<T>) => Promise<BaseResults[]>,
  filter: {},
): Promise<void> => {
  jest.spyOn(model, 'find').mockResolvedValue([mockValue]);
  const result = await resultFn(params, model);

  expect(model.find).toHaveBeenCalledWith(filter);
  expect(result).toEqual([mockValue]);
};
