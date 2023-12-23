export interface BaseFilter {
  'Czy przyznano mandat': string | { $exists: boolean };
  'Nr okręgu': { $in: string[] } | { $exists: boolean };
  'Pozycja na liście': { $in: string[] } | { $exists: boolean };
  Płeć: { $in: string[] };
  Zawód: { $in: string[] } | { $exists: boolean };
  'Miejsce zamieszkania': { $in: string[] } | { $exists: boolean };
  'Liczba głosów': { $gte: number; $lte: number };
}
