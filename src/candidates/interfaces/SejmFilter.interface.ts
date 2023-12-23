import { BaseFilter } from './BaseFilter.interface';

export interface SejmFilter extends BaseFilter {
  'Nr listy': { $in: string[] } | { $exists: boolean };
}
