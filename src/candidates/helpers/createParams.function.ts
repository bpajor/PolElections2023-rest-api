import { paramsDto } from '../dto';

export const createParams = (overrides = {}, del_lnum?: boolean) => {
  const defaultParams: paramsDto = {
    is_deputy: true,
    o_num: undefined,
    c_pos: undefined,
    l_num: undefined,
    sex: 'Mężczyzna,Kobieta',
    proffesion: undefined,
    home: undefined,
    min_vote_num: undefined,
    max_vote_num: undefined,
    min_vote_percent: undefined,
    max_vote_percent: undefined,
  };

  if (del_lnum) delete defaultParams.l_num;

  return { ...defaultParams, ...overrides };
};
