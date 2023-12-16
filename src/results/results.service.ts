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
    options: { resultsLayer: ResultsOptions; filterLayer?: ResultsOptions },
  ): Promise<BaseResultsDocument[]> {
    switch (options.resultsLayer) {
      case ResultsOptions.OBWODY:
        await this.getObwody(
          params as ExtendedResultsObwodyDto,
          this.obwodyResultsModel,
        );
        break;
      case ResultsOptions.WOJEWODZTWA:
        await this.getWojewodztwa(
          params as ExtendedResultsWojewodztwaDto,
          this.wojewodztwaResultsModel,
        );
        break;
      case ResultsOptions.POWIATY:
        switch (options.filterLayer) {
          case ResultsOptions.OBWODY:
            await this.getObwody(
              params as ExtendedResultsObwodyDto,
              this.powiatyResultsModel,
            );
            break;
          case ResultsOptions.POWIATY:
            await this.getPowiaty(
              params as ExtendedResultsPowiatyDto,
              this.powiatyResultsModel,
            );
            break;
          case ResultsOptions.WOJEWODZTWA:
            await this.getWojewodztwa(
              params as ExtendedResultsWojewodztwaDto,
              this.wojewodztwaResultsModel,
            );
            break;
          default:
            throw new Error('Internal Server Error');
        }
        break;
      case ResultsOptions.GMINY:
        switch (options.filterLayer) {
          case ResultsOptions.OBWODY:
            await this.getObwody(
              params as ExtendedResultsObwodyDto,
              this.gminyResultsModel,
            );
            break;
          case ResultsOptions.POWIATY:
            await this.getPowiaty(
              params as ExtendedResultsPowiatyDto,
              this.gminyResultsModel,
            );
            break;
          case ResultsOptions.GMINY:
            await this.getGminy(
              params as ExtendedResultsGminyDto,
              this.gminyResultsModel,
            );
            break;
          default:
            throw new Error('Internal Server Error');
        }
        break;
      default:
        throw new Error('Internal Server Error');
    }
    if (options.resultsLayer === ResultsOptions.GMINY) {
      this.removeChars();
    }
    this.filterAll(params);
    return this.results;
  }

  async getObwody(params: ExtendedResultsObwodyDto, model: Model<any>) {
    if (Object.keys(params).length === 0) {
      this.results = await model.find();
      return;
    }
    this.results = await model.find({
      'Nr okręgu': { $in: params.o_num.split(',') },
    });
  }

  async getWojewodztwa(
    params: ExtendedResultsWojewodztwaDto,
    model: Model<any>,
  ) {
    if (Object.keys(params).length === 0) {
      this.results = await model.find();
      return;
    }
    this.results = await model.find({
      Województwo: { $in: params.woj.split(',') },
    });
  }

  async getPowiaty(params: ExtendedResultsPowiatyDto, model: Model<any>) {
    if (Object.keys(params).length === 0) {
      this.results = await model.find();
      return;
    }
    this.results = await model.find({
      Powiat: { $in: params.pow.split(',') },
    });
  }

  async getGminy(params: ExtendedResultsGminyDto, model: Model<any>) {
    if (Object.keys(params).length === 0) {
      this.results = await model.find();
      return;
    }
    const gminy = params.gmina
      .split(',')
      .map((gmina) => new RegExp(gmina.trim(), 'i'));
    this.results = await model.find({
      Gmina: { $in: gminy },
    });
  }

  /**
   * Removes unnecessary characters from the Gmina field.
   */
  removeChars(): void {
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
  filterAll(params: ExtendedResultsDto): void {
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
