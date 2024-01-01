import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CandidatesModule } from './candidates/candidates.module';
import { ResultsController } from './results/results.controller';
import { ResultsService } from './results/results.service';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      process.env.URI,
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    CandidatesModule,
    ResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
