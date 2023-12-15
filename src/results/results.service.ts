import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtendedResultsObwodyDto } from '../candidates/dto/extended-results-obwody.dto'; //TODO - change destination to src/results/dto/extended-results-obwody.dto
import { ObwodyResult } from 'src/schemas/ResultsObwody.schema';
import { ExtendedResultsWojewodztwaDto } from 'src/candidates/dto/extended-results-wojewodztwa.dto';
import { ExtendedResultsDto } from './types/types.dto';
import { WojewodztwaResult } from 'src/schemas/WojewodztwaResults.schema';
import { ResultsOptions } from 'src/enums/results-options.enum';
import { PowiatyResult } from 'src/schemas/ResultsPowiaty.schema';
import { ExtendedResultsPowiatyDto } from 'src/candidates/dto/extended-results-powiaty.dto';
import { BaseResultsDocument } from 'src/schemas/BaseResult.schema';
import {
  GminyResult,
  GminyResultDocument,
} from 'src/schemas/GminyResult.schema';
import { ExtendedResultsGminyDto } from 'src/candidates/dto/extended-results-gminy.dto';

@Injectable()
export class ResultsService {
  private results: BaseResultsDocument[];

  constructor(
    @InjectModel(ObwodyResult.name)
    private obwodyResultsModel: Model<ObwodyResult>,
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
   * @returns A promise that resolves to an array of Results objects.
   */
  async getResults(
    params: ExtendedResultsDto,
    options: { option: string },
  ): Promise<BaseResultsDocument[]> {
    switch (options.option) {
      case ResultsOptions.OBWODY:
        this.results = await this.obwodyResultsModel.find();
        break;
      case ResultsOptions.WOJEWODZTWA:
        this.results = await this.wojewodztwaResultsModel.find();
        break;
      case ResultsOptions.POWIATY:
        this.results = await this.powiatyResultsModel.find();
        break;
      case ResultsOptions.GMINY:
        this.results = await this.gminyResultsModel.find();
        break;
      default:
        throw new Error('Internal Server Error');
    }
    if (options.option === ResultsOptions.GMINY) {
      this.removeChars(params as ExtendedResultsGminyDto);
    }
    this.filterAll(params, options);
    return this.results;
  }

  removeChars(params: ExtendedResultsGminyDto): void {
    this.results.map((result: GminyResultDocument) => {
      result.Gmina = result.Gmina.replace('m. ', '');
      result.Gmina = result.Gmina.replace('g', '');
    });
  }

  /**
   * Filters the results based on the provided parameters.
   *
   * @param params - The parameters used to filter the results.
   */
  filterAll(params: ExtendedResultsDto, options: { option: string }): void {
    switch (options.option) {
      case ResultsOptions.OBWODY:
        this.filterByONum(params as ExtendedResultsObwodyDto);
        break;
      case ResultsOptions.WOJEWODZTWA:
        this.filterByWoj(params as ExtendedResultsWojewodztwaDto);
        break;
      case ResultsOptions.POWIATY:
        this.filterByONum(params as ExtendedResultsObwodyDto);
        this.filterByWoj(params as ExtendedResultsWojewodztwaDto);
        this.filterByPow(params as ExtendedResultsPowiatyDto);
        break;
      case ResultsOptions.GMINY:
        this.filterByONum(params as ExtendedResultsObwodyDto);
        this.filterByWoj(params as ExtendedResultsWojewodztwaDto);
        this.filterByPow(params as ExtendedResultsPowiatyDto);
        this.filterByGmina(params as ExtendedResultsGminyDto);
        break;
    }
    this.filterByMinAndMaxVoteAttendancePerc(
      params.min_attendance_percent,
      params.max_attendance_percent,
    );
    this.filterByMinAndMaxInvalidVotesPerc(
      params.min_invalid_votes_percent,
      params.max_invalid_votes_percent,
    );
  }

  /**
   * Filters the results by the provided o_num.
   *
   * @param o_num - The o_num used to filter the results.
   */
  filterByONum(params: ExtendedResultsObwodyDto): void {
    const o_num = params.o_num;
    if (!o_num) return;
    const o_nums = o_num.split(',');
    const filteredresults = this.results.filter((results) => {
      return o_nums.includes(results['Nr okręgu'].toString());
    });
    this.results = filteredresults;
  }

  filterByWoj(params: ExtendedResultsWojewodztwaDto): void {
    const woj = params.woj;
    if (!woj) return;
    const wojs = woj.split(',');
    const filteredresults = this.results.filter((results) => {
      return wojs.includes(results['Województwo']);
    });
    this.results = filteredresults;
  }

  filterByPow(params: ExtendedResultsPowiatyDto): void {
    const pow = params.pow;
    if (!pow) return;
    const pows = pow.split(',');
    const filteredresults = this.results.filter((results) => {
      return pows.includes(results['Powiat']);
    });
    this.results = filteredresults;
  }

  filterByGmina(params: ExtendedResultsGminyDto): void {
    const gmina = params.gmina;
    if (!gmina) return;
    const gminas = gmina.split(',');
    const filteredresults = this.results.filter((results) => {
      if (results['Powiat'] !== 'bocheński') return false;
      // if (results['Powiat'] !== params.pow) return false;
      console.log(results['Gmina']);
      return gminas.includes(results['Gmina']);
    });
    this.results = filteredresults;
  }

  /**
   * Filters the results by the provided min_attendance_percent and max_attendance_percent.
   *
   * @param min_attendance_percent - The minimum attendance percentage used to filter the results.
   * @param max_attendance_percent - The maximum attendance percentage used to filter the results.
   */
  filterByMinAndMaxVoteAttendancePerc(
    min_attendance_percent: number,
    max_attendance_percent: number,
  ): void {
    if (!min_attendance_percent && !max_attendance_percent) return;
    if (!min_attendance_percent) min_attendance_percent = 0;
    if (!max_attendance_percent)
      max_attendance_percent = Number.MAX_SAFE_INTEGER;
    const filteredresults = this.results.filter((results) => {
      return (
        parseFloat(results['Frekwencja']) >= min_attendance_percent &&
        parseFloat(results['Frekwencja']) <= max_attendance_percent
      );
    });
    this.results = filteredresults;
  }

  /**
   * Filters the results by the provided min_invalid_votes_percent and max_invalid_votes_percent.
   *
   * @param min_invalid_votes_percent - The minimum percentage of invalid votes used to filter the results.
   * @param max_invalid_votes_percent - The maximum percentage of invalid votes used to filter the results.
   */
  filterByMinAndMaxInvalidVotesPerc(
    min_invalid_votes_percent: number,
    max_invalid_votes_percent: number,
  ): void {
    if (!min_invalid_votes_percent && !max_invalid_votes_percent) return;
    if (!min_invalid_votes_percent) min_invalid_votes_percent = 0;
    if (!max_invalid_votes_percent)
      max_invalid_votes_percent = Number.MAX_SAFE_INTEGER;
    console.log(min_invalid_votes_percent, max_invalid_votes_percent);
    const filteredresults = this.results.filter((results) => {
      return (
        parseFloat(results['Procent głosów nieważnych'].replace(',', '.')) >=
          min_invalid_votes_percent &&
        parseFloat(results['Procent głosów nieważnych'].replace(',', '.')) <=
          max_invalid_votes_percent
      );
    });
    this.results = filteredresults;
  }
}
