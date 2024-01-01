import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type BaseCandidateDocument = HydratedDocument<BaseCandidate>;

export class BaseCandidate {
  @ApiProperty({
    description: 'Number of okreg',
    example: 1,
  })
  @Prop()
  ['Nr okręgu']: number;

  // @Prop()
  // ['Nr listy']: number;

  @ApiProperty({
    description: 'Position on list',
    example: 1,
  })
  @Prop()
  ['Pozycja na liście']: number;

  @ApiProperty({
    description: 'First name and last name',
    example: 'Donald Tusk',
  })
  @Prop()
  ['Nazwisko i imiona']: string;


  @ApiProperty({
    description: 'Committee name',
    example: 'KOMITET WYBORCZY KOALICJA OBYWATELSKA PO N. IPL ZIELONI',
  })
  @Prop()
  ['Nazwa komitetu']: string;

  @ApiProperty({
    description: 'Sex',
    example: 'Mężczyzna',
  })
  @Prop()
  ['Płeć']: string;

  @ApiProperty({
    description: 'Profession',
    example: 'Polityk',
  })
  @Prop()
  ['Zawód']: string;

  @ApiProperty({
    description: 'Place of residence',
    example: 'Gdańsk',
  })
  @Prop()
  ['Miejsce zamieszkania']: string;

  @ApiProperty({
    description: 'Number of votes',
    example: 1234,
  })
  @Prop()
  ['Liczba głosów']: number;

  @ApiProperty({
    description: 'Percentage of votes in okreg',
    example: '10.55',
  })
  @Prop()
  ['Procent głosów oddanych w okręgu']: string;

  @ApiProperty({
    description: 'Did candidate get mandate',
    example: 'Tak',
  })
  @Prop()
  ['Czy przyznano mandat']: string;
}

export const BaseCandidateSchema = SchemaFactory.createForClass(BaseCandidate);
