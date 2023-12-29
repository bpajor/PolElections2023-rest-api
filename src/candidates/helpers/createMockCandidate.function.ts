import { BaseCandidate } from 'src/schemas/BaseCandidate.schema';

export const createMockCandidate = <T extends BaseCandidate>(
  overrides?: Partial<T>,
): T => {
  const defaultResult: BaseCandidate = {
    'Nr okręgu': 1,
    'Pozycja na liście': 15,
    'Nazwisko i imiona': 'Bartosz ŁASICA',
    'Nazwa komitetu':
      'KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE',
    Płeć: 'Mężczyzna',
    Zawód: 'rolnik',
    'Miejsce zamieszkania': 'Nawojów Łużycki',
    'Liczba głosów': 1113,
    'Procent głosów oddanych w okręgu': '0,22',
    'Czy przyznano mandat': 'Nie',
  };

  return { ...defaultResult, ...overrides } as T;
};
