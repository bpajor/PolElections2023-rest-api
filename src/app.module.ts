import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://pajor394:TACkxs0UNGUjDNBf@electionscluster.wir8tuv.mongodb.net/electionsDB',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
