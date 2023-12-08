import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtGuard } from 'src/auth/guard';
import { Candidate } from 'src/schemas/candidate.schema';
import { User } from 'src/schemas/user.schema';
import { paramsDto } from './dto';

@Injectable()
export class CandidatesService {
  private candidates: Candidate[];

  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
  ) {}

  async getCandidates(params: paramsDto): Promise<Candidate[]> {
    try {
      if (params.is_deputy) {
        this.candidates = await this.candidateModel
          .find()
          .where('Czy przyznano mandat')
          .equals('Tak');
      } else {
        this.candidates = await this.candidateModel.find();
      }
      this.filterAll(params);
      return this.candidates;
    } catch (error) {
      console.log(error);
    }
  }

  /** Takes paramsDto and filters candidates table basing on them */
  filterAll(params: paramsDto): void {
    this.filterByONum(params.o_num);
    this.filterByCPos(params.c_pos);
    this.filterByLNum(params.l_num);
    this.filterBySex(params.sex);
    this.filterByProffesion(params.proffesion);
    this.filterByHome(params.home);
    this.filterbyMinAndMaxVoteNum(params.min_vote_num, params.max_vote_num);
    this.filterbyMinAndMaxVotePercent(
      params.min_vote_percent,
      params.max_vote_percent,
    );
  }

  /** Takes o_num string and filters candidates table basing on it */
  filterByONum(o_num: string): void {
    if (!o_num) return;
    const o_nums = o_num.split(',');
    const filteredCandidates = this.candidates.filter((candidate) => {
      return o_nums.includes(candidate['Nr okręgu'].toString());
    });
    this.candidates = filteredCandidates;
  }

  /** Takes c_pos string and filters candidates table basing on it */
  filterByCPos(c_pos: string): void {
    if (!c_pos) return;
    const c_poses = c_pos.split(',');
    const filteredCandidates = this.candidates.filter((candidate) => {
      return c_poses.includes(candidate['Pozycja na liście'].toString());
    });
    this.candidates = filteredCandidates;
  }

  /** Takes l_num string and filters candidates table basing on it */
  filterByLNum(l_num: string): void {
    if (!l_num) return;
    const l_nums = l_num.split(',');
    const filteredCandidates = this.candidates.filter((candidate) => {
      return l_nums.includes(candidate['Nr listy'].toString());
    });
    this.candidates = filteredCandidates;
  }

  /** Takes sex string and filters candidates table basing on it*/
  filterBySex(sex: string): void {
    if (!sex) return;
    if (sex === 'K') {
      sex = 'Kobieta';
    } else {
      sex = 'Mężczyzna';
    }
    const filteredCandidates = this.candidates.filter((candidate) => {
      return candidate['Płeć'] === sex;
    });
    this.candidates = filteredCandidates;
  }

  /** Takes proffesion string and filters candidates table basing on it */
  filterByProffesion(proffesion: string): void {
    if (!proffesion) return;
    const filteredCandidates = this.candidates.filter((candidate) => {
      return candidate['Zawód'] === proffesion;
    });
    this.candidates = filteredCandidates;
  }

  /** Takes home string and filters candidates table basing on it */
  filterByHome(home: string): void {
    if (!home) return;
    const filteredCandidates = this.candidates.filter((candidate) => {
      return candidate['Miejsce zamieszkania'] === home;
    });
    this.candidates = filteredCandidates;
  }

  /** Takes min_vote_num and max_vote_num numbers and filters candidates table basing on them */
  filterbyMinAndMaxVoteNum(min_vote_num: number, max_vote_num: number): void {
    if (!min_vote_num && !max_vote_num) return;
    if (!min_vote_num) min_vote_num = 0;
    if (!max_vote_num) max_vote_num = Number.MAX_SAFE_INTEGER;
    const filteredCandidates = this.candidates.filter((candidate) => {
      return (
        candidate['Liczba głosów'] >= min_vote_num &&
        candidate['Liczba głosów'] <= max_vote_num
      );
    });
    this.candidates = filteredCandidates;
  }

  /** Takes min_vote_percent and max_vote_percent numbers and filters candidates table basing on them */
  filterbyMinAndMaxVotePercent(
    min_vote_percent: number,
    max_vote_percent: number,
  ): void {
    if (!min_vote_percent && !max_vote_percent) return;
    if (!min_vote_percent) min_vote_percent = 0;
    if (!max_vote_percent) max_vote_percent = Number.MAX_SAFE_INTEGER;
    const filteredCandidates = this.candidates.filter((candidate) => {
      return (
        parseInt(candidate['Procent głosów oddanych w okręgu']) >=
          min_vote_percent &&
        parseInt(candidate['Procent głosów oddanych w okręgu']) <=
          max_vote_percent
      );
    });
    this.candidates = filteredCandidates;
  }
}
