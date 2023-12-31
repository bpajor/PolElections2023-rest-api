import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtendedResultsOkregiDto } from './dto/extended-results-okregi.dto';
import { OkregiResult } from '../schemas/ResultsOkregi.schema';
import { ExtendedResultsWojewodztwaDto } from '../results/dto/extended-results-wojewodztwa.dto';
import { ExtendedResultsDto } from './types/types.dto';
import { WojewodztwaResult } from '../schemas/WojewodztwaResults.schema';
import { ResultsOptions } from '../enums/results-options.enum';
import { PowiatyResult } from '../schemas/ResultsPowiaty.schema';
import { ExtendedResultsPowiatyDto } from '../results/dto/extended-results-powiaty.dto';
import { BaseResults, BaseResultsDocument } from '../schemas/BaseResult.schema';
import {
  GminyResult,
  GminyResultDocument,
} from '../schemas/GminyResult.schema';
import { ExtendedResultsGminyDto } from '../results/dto/extended-results-gminy.dto';
import { max } from 'class-validator';

/**
 * Service class for managing election results.
 */
@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(OkregiResult.name)
    private okregiResultsModel: Model<OkregiResult>,
    @InjectModel(WojewodztwaResult.name)
    private wojewodztwaResultsModel: Model<WojewodztwaResult>,
    @InjectModel(PowiatyResult.name)
    private powiatyResultsModel: Model<PowiatyResult>,
    @InjectModel(GminyResult.name)
    private gminyResultsModel: Model<GminyResult>,
  ) {}

  /**
   * Retrieves the election results based on the provided parameters.
   *
   * @param params - The parameters used to filter the results.
   * @param options - The options used to specify the results layer and filter layer.
   * @returns A promise that resolves to an array of Results objects.
   */
  async getResults(
    params: ExtendedResultsDto,
    options: { resultsLayer: ResultsOptions },
  ): Promise<BaseResults[]> {
    let results: BaseResults[];
    try {
      const layerToFunctionMap = {
        [ResultsOptions.OKREGI]: this.getOkregi,
        [ResultsOptions.WOJEWODZTWA]: this.getWojewodztwa,
        [ResultsOptions.POWIATY]: this.getPowiaty,
        [ResultsOptions.GMINY]: this.getGminy,
      };

      const modelMap = {
        [ResultsOptions.OKREGI]: this.okregiResultsModel,
        [ResultsOptions.WOJEWODZTWA]: this.wojewodztwaResultsModel,
        [ResultsOptions.POWIATY]: this.powiatyResultsModel,
        [ResultsOptions.GMINY]: this.gminyResultsModel,
      };

      const getResultsFunction = layerToFunctionMap[options.resultsLayer];
      if (!getResultsFunction) {
        throw new Error('Invalid results layer');
      }

      const model: Model<
        OkregiResult | WojewodztwaResult | PowiatyResult | GminyResult
      > = modelMap[options.resultsLayer];
      if (!model) {
        throw new Error('Invalid model');
      }

      results = await getResultsFunction.call(this, params, model);

      if (options.resultsLayer === ResultsOptions.GMINY) {
        results = this.removeChars(results as GminyResultDocument[]);
      }
      results = this.filterAll(params, results);
      if (Object.keys(results).length === 0) {
        throw new HttpException(
          'No results match the provided parameters',
          HttpStatus.NOT_FOUND,
        );
      }
      return results;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves the election results for the specified okregi.
   *
   * @param params - The parameters used to filter the results.
   * @param model - The Mongoose model used to query the database.
   * @returns A promise that resolves to an array of Results objects.
   */
  async getOkregi(
    params: ExtendedResultsOkregiDto,
    model: Model<OkregiResult>,
  ): Promise<BaseResults[]> {
    return await model.find({
      'Nr okręgu': params.o_num
        ? { $in: params.o_num.split(',') }
        : { $exists: true },
    });
  }

  /**
   * Retrieves the election results for the specified wojewodztwa.
   *
   * @param params - The parameters used to filter the results.
   * @param model - The Mongoose model used to query the database.
   * @returns A promise that resolves to an array of Results objects.
   */
  async getWojewodztwa(
    params: ExtendedResultsWojewodztwaDto,
    model: Model<WojewodztwaResult>,
  ): Promise<BaseResultsDocument[]> {
    if (!params.woj) return await model.find({});
    return await model.find({
      Województwo: {
        $in: params.woj.split(','),
      },
    });
  }

  /**
   * Retrieves the election results for the specified powiaty.
   *
   * @param params - The parameters used to filter the results.
   * @param model - The Mongoose model used to query the database.
   * @returns A promise that resolves to an array of Results objects.
   */
  async getPowiaty(
    params: ExtendedResultsPowiatyDto,
    model: Model<PowiatyResult>,
  ): Promise<BaseResultsDocument[]> {
    try {
      let results: BaseResultsDocument[];
      if (!params.pow) {
        results = await model.find({});
      } else {
        results = await model.find({
          Powiat: {
            $in: params.pow.split(','),
          },
        });
      }

      if (params.woj) {
        return results.filter((result) => {
          return params.woj.split(',').includes(result['Województwo']);
        });
      }

      if (params.o_num) {
        return results.filter((result) => {
          return params.o_num
            .split(',')
            .includes(result['Nr okręgu'].toString());
        });
      }
      return results;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Retrieves the election results for the specified gminy.
   *
   * @param params - The parameters used to filter the results.
   * @param model - The Mongoose model used to query the database.
   * @returns A promise that resolves to an array of Results objects.
   */
  async getGminy(
    params: ExtendedResultsGminyDto,
    model: Model<GminyResult>,
  ): Promise<BaseResults[]> {
    let gminy: BaseResults[];
    if (!params.gmina) {
      gminy = await model.find({});
    } else {
      const gminyPattern: RegExp[] = params.gmina.split(',').map((gmina) => {
        return new RegExp(gmina.trim(), 'i');
      });
      gminy = await model.find({
        Gmina: {
          $in: gminyPattern,
        },
      });
    }

    if(params.pow) {
      gminy = gminy.filter((gmina) => {
        return params.pow.split(',').includes(gmina['Powiat']);
      });
    }

    if(params.o_num) {
      gminy = gminy.filter((gmina) => {
        return params.o_num.split(',').includes(gmina['Nr okręgu'].toString());
      });
    }

    return gminy;
  }

  /**
   * Removes unnecessary characters from the Gmina field.
   *
   * @param results - The array of GminyResultDocument objects to be modified.
   * @returns The modified array of GminyResultDocument objects.
   */
  removeChars(results: GminyResult[]): GminyResult[] {
    try {
      return results.map((result: GminyResult) => {
        result.Gmina = result.Gmina.replace('m. ', '');
        result.Gmina = result.Gmina.replace('g', '');
        return result;
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Filters the results based on the provided parameters.
   *
   * @param params - The parameters used to filter the results.
   * @param results - The array of BaseResultsDocument objects to be filtered.
   * @returns The filtered array of BaseResultsDocument objects.
   */
  filterAll(params: ExtendedResultsDto, results: BaseResults[]): BaseResults[] {
    console.log('params in filter all: ', {params: {min_attendance_percent: params.min_attendance_percent, max_attendance_percent: params.max_attendance_percent}})
    results = this.filterByMinAndMaxVoteAttendancePerc(
      params.min_attendance_percent,
      params.max_attendance_percent,
      results,
    );
    results = this.filterByMinAndMaxInvalidVotesPerc(
      params.min_invalid_votes_percent,
      params.max_invalid_votes_percent,
      results,
    );
    return results;
  }

  /**
   * Filters the results by the provided min_attendance_percent and max_attendance_percent.
   *
   * @param min_attendance_percent - The minimum attendance percentage used to filter the results.
   * @param max_attendance_percent - The maximum attendance percentage used to filter the results.
   * @param results - The array of BaseResultsDocument objects to be filtered.
   * @returns The filtered array of BaseResultsDocument objects.
   */
  filterByMinAndMaxVoteAttendancePerc(
    min_attendance_percent: number,
    max_attendance_percent: number,
    results: BaseResults[],
  ): BaseResults[] {
    if (min_attendance_percent===undefined && max_attendance_percent===undefined) return results;
    if (!min_attendance_percent===undefined) min_attendance_percent = 0;
    if (max_attendance_percent === undefined) max_attendance_percent = 100;

    console.log({ min_attendance_percent, max_attendance_percent });

    const filteredresults = results.filter((results) => {
      let attendance = Number(results['Frekwencja'].replace(',', '.'));
      if (isNaN(attendance)) {
        throw new Error(`Invalid attendance value: ${results['Frekwencja']}`);
      }
      return (
        attendance >= min_attendance_percent &&
        attendance <= max_attendance_percent
      );
    });
    return filteredresults;
  }

  /**
   * Filters the results by the provided min_invalid_votes_percent and max_invalid_votes_percent.
   *
   * @param min_invalid_votes_percent - The minimum percentage of invalid votes used to filter the results.
   * @param max_invalid_votes_percent - The maximum percentage of invalid votes used to filter the results.
   * @param results - The array of BaseResultsDocument objects to be filtered.
   * @returns The filtered array of BaseResultsDocument objects.
   */
  filterByMinAndMaxInvalidVotesPerc(
    min_invalid_votes_percent: number,
    max_invalid_votes_percent: number,
    results: BaseResults[],
  ): BaseResults[] {
    if (min_invalid_votes_percent===undefined && max_invalid_votes_percent===undefined)
      return results;
    if (min_invalid_votes_percent===undefined) min_invalid_votes_percent = 0;
    if (max_invalid_votes_percent === undefined)
      max_invalid_votes_percent = 100;
    console.log({ min_invalid_votes_percent, max_invalid_votes_percent })
    const filteredresults = results.filter((results) => {
      let invalidVotesPercent = Number(
        results['Procent głosów nieważnych'].replace(',', '.'),
      );
      if (isNaN(invalidVotesPercent)) {
        throw new Error(
          `Invalid votes percent value: ${results['Procent głosów nieważnych']}`,
        );
      }
      return (
        invalidVotesPercent >= min_invalid_votes_percent &&
        invalidVotesPercent <= max_invalid_votes_percent
      );
    });
    return filteredresults;
  }
}
