import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ObwodyResultSchema,
  ObwodyResult,
} from 'src/schemas/ResultsObwody.schema';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import {
  WojewodztwaResult,
  WojewodztwaResultSchema,
} from 'src/schemas/WojewodztwaResults.schema';
import {
  PowiatyResult,
  PowiatyResultSchema,
} from 'src/schemas/ResultsPowiaty.schema';
import { GminyResult, GminyResultSchema } from 'src/schemas/GminyResult.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ObwodyResult.name, schema: ObwodyResultSchema },
      { name: WojewodztwaResult.name, schema: WojewodztwaResultSchema },
      { name: PowiatyResult.name, schema: PowiatyResultSchema },
      { name: GminyResult.name, schema: GminyResultSchema },
    ]),
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
