import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OkregiResultSchema,
  OkregiResult,
} from '../schemas/ResultsOkregi.schema';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import {
  WojewodztwaResult,
  WojewodztwaResultSchema,
} from '../schemas/WojewodztwaResults.schema';
import {
  PowiatyResult,
  PowiatyResultSchema,
} from '../schemas/ResultsPowiaty.schema';
import { GminyResult, GminyResultSchema } from '../schemas/GminyResult.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OkregiResult.name, schema: OkregiResultSchema },
      { name: WojewodztwaResult.name, schema: WojewodztwaResultSchema },
      { name: PowiatyResult.name, schema: PowiatyResultSchema },
      { name: GminyResult.name, schema: GminyResultSchema },
    ]),
  ],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
