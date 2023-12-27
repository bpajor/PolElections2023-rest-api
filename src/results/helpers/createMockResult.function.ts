import { BaseResults } from 'src/schemas/BaseResult.schema';
import { WojewodztwaResult } from 'src/schemas/WojewodztwaResults.schema';

export const createMockResult = <T extends BaseResults>(
  overrides: Partial<T>,
): T => {
  const defaultResult: BaseResults = {
    Frekwencja: '71,45',
    'Procent głosów nieważnych': '1,95',
    'KOMITET WYBORCZY BEZPARTYJNI SAMORZĄDOWCY': '3,34',
    'KOALICYJNY KOMITET WYBORCZY TRZECIA DROGA POLSKA 2050 SZYMONA HOŁOWNI - POLSKIE STRONNICTWO LUDOWE':
      '10,75',
    'KOMITET WYBORCZY NOWA LEWICA': '9,51',
    'KOMITET WYBORCZY PRAWO I SPRAWIEDLIWOŚĆ': '34,80',
    'KOMITET WYBORCZY KONFEDERACJA WOLNOŚĆ I NIEPODLEGŁOŚĆ': '6,33',
    'KOALICYJNY KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N IPL ZIELONI':
      '33,78',
    'KOMITET WYBORCZY POLSKA JEST JEDNA': '1,49',
    'KOMITET WYBORCZY WYBORCÓW MNIEJSZOŚĆ NIEMIECKA': undefined,
    'KOMITET WYBORCZY WYBORCÓW RUCHU DOBROBYTU I POKOJU': undefined,
    'KOMITET WYBORCZY NORMALNY KRAJ': undefined,
    'KOMITET WYBORCZY ANTYPARTIA': undefined,
    'KOMITET WYBORCZY RUCH NAPRAWY POLSKI': undefined,
  };

  return { ...defaultResult, ...overrides } as T;
};
