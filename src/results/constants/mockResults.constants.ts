import { GminyResult } from 'src/schemas/GminyResult.schema';
import { OkregiResult } from 'src/schemas/ResultsOkregi.schema';
import { PowiatyResult } from 'src/schemas/ResultsPowiaty.schema';
import { WojewodztwaResult } from 'src/schemas/WojewodztwaResults.schema';
import { createMockResult } from '../helpers/createMockResult.function';

export const mockWojewodztwo: WojewodztwaResult =
  createMockResult<WojewodztwaResult>({ Województwo: 'lubelskie' });
export const mockOkreg: OkregiResult = createMockResult<OkregiResult>({
  ['Nr okręgu']: 1,
});
export const mockPowiat: PowiatyResult = createMockResult<PowiatyResult>({
  Powiat: 'ząbkowicki',
  Województwo: 'dolnośląskie',
  ['Nr okręgu']: 2,
});
export const mockGmina: GminyResult = createMockResult<GminyResult>({
  Gmina: 'Żegocina',
  Powiat: 'bocheński',
  Województwo: 'małopolskie',
  'Nr okręgu': 13,
});
