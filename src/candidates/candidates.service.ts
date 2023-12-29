import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Candidate } from '../schemas/candidate.schema';
import { paramsDto } from './dto';
import { CandidateSenat } from '../schemas/CandidateSenat.schema';
import { BaseFilter } from './interfaces/BaseFilter.interface';
import { SenatFilter } from './interfaces/SenatFilter.interface';
import { SejmFilter } from './interfaces/SejmFilter.interface';
import { BaseCandidate } from 'src/schemas/BaseCandidate.schema';

@Injectable()
/**
 * Service class for managing candidates.
 */
export class CandidatesService {
  /**
   * Creates an instance of CandidatesService.
   * @param candidateModel - The model for the Candidate collection.
   * @param candidateSenatModel - The model for the CandidateSenat collection.
   */
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
    @InjectModel(CandidateSenat.name)
    private candidateSenatModel: Model<CandidateSenat>,
  ) {}

  /**
   * Retrieves candidates based on the provided parameters.
   * @param params - The parameters for filtering candidates.
   * @param endpoint - The endpoint for retrieving candidates (senat or sejm).
   * @returns A promise that resolves to an array of Candidate objects.
   */
  async getCandidates(
    params: paramsDto,
    endpoint: string,
  ): Promise<BaseCandidate[]> {
    const {
      o_num,
      sex,
      c_pos,
      l_num,
      proffesion,
      home,
      min_vote_num,
      max_vote_num,
      min_vote_percent,
      max_vote_percent,
      is_deputy,
    } = params;
    const defaultFilters: BaseFilter = {
      'Czy przyznano mandat': is_deputy ? 'Tak' : { $exists: true },
      'Nr okręgu': o_num ? { $in: o_num.split(',') } : { $exists: true },
      'Pozycja na liście': c_pos
        ? { $in: c_pos.split(',') }
        : { $exists: true },

      Płeć: { $in: sex.split(',') },
      Zawód: proffesion ? { $in: proffesion.split(',') } : { $exists: true },
      'Miejsce zamieszkania': home
        ? { $in: home.split(',') }
        : { $exists: true },
      'Liczba głosów': {
        $gte: min_vote_num ? min_vote_num : 0,
        $lte: max_vote_num ? max_vote_num : Number.MAX_SAFE_INTEGER,
      },
    };
    try {
      if (endpoint === 'senat') {
        const candidates = await this.getSenat(
          defaultFilters as SenatFilter,
          min_vote_percent,
          max_vote_percent,
          min_vote_num,
          max_vote_num,
        );
        if (!candidates.length) {
          throw new HttpException('No candidates found', HttpStatus.NOT_FOUND);
        }
        return candidates;
      }

      const candidates = await this.getSejm(
        defaultFilters as SejmFilter,
        min_vote_percent,
        max_vote_percent,
        min_vote_num,
        max_vote_num,
        l_num,
      );
      if (!candidates.length) {
        throw new HttpException('No candidates found', HttpStatus.NOT_FOUND);
      }
      return candidates;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new Error('Internal Server Error');
    }
  }

  /**
   * Retrieves candidates from the CandidateSenat collection based on the provided filters.
   * @param filters - The filters for querying candidates.
   * @param min_vote_percent - The minimum vote percentage.
   * @param max_vote_percent - The maximum vote percentage.
   * @returns A promise that resolves to an array of CandidateSenat objects.
   */
  async getSenat(
    filters: SenatFilter,
    min_vote_percent: number,
    max_vote_percent: number,
    min_vote_num: number,
    max_vote_num: number,
  ): Promise<BaseCandidate[]> {
    try {
      let candidates = (await this.candidateSenatModel.find(
        filters,
      )) as CandidateSenat[];
      candidates = this.filterbyMinAndMaxVotePercent(
        candidates,
        min_vote_percent,
        max_vote_percent,
      );
      candidates = this.filterbyMinAndMaxVoteNum(
        candidates,
        min_vote_num,
        max_vote_num,
      );
      return candidates;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Retrieves candidates from the Candidate collection based on the provided filters.
   * @param filters - The filters for querying candidates.
   * @param min_vote_percent - The minimum vote percentage.
   * @param max_vote_percent - The maximum vote percentage.
   * @param l_num - The list number.
   * @returns A promise that resolves to an array of Candidate objects.
   */
  async getSejm(
    filters: SejmFilter,
    min_vote_percent: number,
    max_vote_percent: number,
    min_vote_num: number,
    max_vote_num: number,
    l_num: string,
  ): Promise<BaseCandidate[]> {
    try {
      filters['Nr listy'] = l_num
        ? { $in: l_num.split(',') }
        : { $exists: true };
      let candidates = (await this.candidateModel.find(
        filters,
      )) as BaseCandidate[];
      candidates = this.filterbyMinAndMaxVotePercent(
        candidates,
        min_vote_percent,
        max_vote_percent,
      );
      candidates = this.filterbyMinAndMaxVoteNum(
        candidates,
        min_vote_num,
        max_vote_num,
      );
      return candidates;
    } catch (error) {
      console.log(error);
    }
  }

  /** Takes min_vote_percent and max_vote_percent numbers and filters candidates table basing on them */
  filterbyMinAndMaxVotePercent(
    candidates: BaseCandidate[],
    min_vote_percent: number,
    max_vote_percent: number,
  ): BaseCandidate[] {
    if (!min_vote_percent && !max_vote_percent) return candidates;
    if (!min_vote_percent) min_vote_percent = 0;
    if (!max_vote_percent) max_vote_percent = Number.MAX_SAFE_INTEGER;
    console.log(candidates);
    const filteredCandidates = candidates.filter((candidate) => {
      return (
        Number(
          candidate['Procent głosów oddanych w okręgu'].replace(',', '.'),
        ) >= min_vote_percent &&
        Number(
          candidate['Procent głosów oddanych w okręgu'].replace(',', '.'),
        ) <= max_vote_percent
      );
    });
    return filteredCandidates;
  }

  filterbyMinAndMaxVoteNum(
    candidates: BaseCandidate[],
    min_vote_num: number,
    max_vote_num: number,
  ): BaseCandidate[] {
    if (!min_vote_num && !max_vote_num) return candidates;
    if (!min_vote_num) min_vote_num = 0;
    if (!max_vote_num) max_vote_num = Number.MAX_SAFE_INTEGER;
    console.log(candidates);
    const filteredCandidates = candidates.filter((candidate) => {
      return (
        candidate['Liczba głosów'] >= min_vote_num &&
        candidate['Liczba głosów'] <= max_vote_num
      );
    });
    return filteredCandidates;
  }

  // filterbyMinAndMaxVotePercent<T extends BaseCandidate>(
  //   candidates: Partial<T>[],
  //   min_vote_percent: number,
  //   max_vote_percent: number,
  // ): Candidate[] | CandidateSenat[] {
  //   if (!min_vote_percent && !max_vote_percent) return candidates;
  //   if (!min_vote_percent) min_vote_percent = 0;
  //   if (!max_vote_percent) max_vote_percent = Number.MAX_SAFE_INTEGER;
  //   console.log(candidates);
  //   const filteredCandidates = candidates.filter((candidate) => {
  //     return (
  //       parseInt(candidate['Procent głosów oddanych w okręgu']) >=
  //         min_vote_percent &&
  //       parseInt(candidate['Procent głosów oddanych w okręgu']) <=
  //         max_vote_percent
  //     );
  //   });
  //   return filteredCandidates;
  // }
}
