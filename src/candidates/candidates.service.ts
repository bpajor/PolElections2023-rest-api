import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtGuard } from 'src/auth/guard';
import { Candidate } from 'src/schemas/candidate.schema';
import { User } from 'src/schemas/user.schema';
import { paramsDto } from './dto';
import { CandidateSenat } from 'src/schemas/CandidateSenat.schema';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
    @InjectModel(CandidateSenat.name)
    private candidateSenatModel: Model<CandidateSenat>,
  ) {}

  async getCandidates(
    params: paramsDto,
    endpoint: string,
  ): Promise<Candidate[]> {
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
    const defaultFilters = {
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
    if (endpoint === 'senat') {
      console.log('in here');
      return await this.getSenat(
        defaultFilters,
        min_vote_percent,
        max_vote_percent,
      );
    }

    return await this.getSejm(
      defaultFilters,
      min_vote_percent,
      max_vote_percent,
      l_num,
    );
  }

  async getSenat(
    filters: {},
    min_vote_percent: number,
    max_vote_percent: number,
  ): Promise<CandidateSenat[]> {
    try {
      let candidates = (await this.candidateSenatModel.find(
        filters,
      )) as CandidateSenat[];
      candidates = this.filterbyMinAndMaxVotePercent(
        candidates,
        min_vote_percent,
        max_vote_percent,
      );
      return candidates;
    } catch (error) {
      console.log(error);
    }
  }

  async getSejm(
    filters: {},
    min_vote_percent: number,
    max_vote_percent: number,
    l_num: string,
  ): Promise<Candidate[]> {
    try {
      filters['Nr listy'] = l_num
        ? { $in: l_num.split(',') }
        : { $exists: true };
      let candidates = (await this.candidateModel.find(filters)) as Candidate[];
      console.log('after filter function');
      candidates = this.filterbyMinAndMaxVotePercent(
        candidates,
        min_vote_percent,
        max_vote_percent,
      );
      return candidates;
    } catch (error) {
      console.log(error);
    }
  }

  /** Takes min_vote_percent and max_vote_percent numbers and filters candidates table basing on them */
  filterbyMinAndMaxVotePercent(
    candidates: Candidate[] | CandidateSenat[],
    min_vote_percent: number,
    max_vote_percent: number,
  ): Candidate[] | CandidateSenat[] {
    if (!min_vote_percent && !max_vote_percent) return candidates;
    if (!min_vote_percent) min_vote_percent = 0;
    if (!max_vote_percent) max_vote_percent = Number.MAX_SAFE_INTEGER;
    console.log(candidates);
    const filteredCandidates = candidates.filter((candidate) => {
      return (
        parseInt(candidate['Procent głosów oddanych w okręgu']) >=
          min_vote_percent &&
        parseInt(candidate['Procent głosów oddanych w okręgu']) <=
          max_vote_percent
      );
    });
    return filteredCandidates;
  }
}
