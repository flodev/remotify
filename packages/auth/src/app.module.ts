import dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { initSequelize, getModels } from '../db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphqlModule } from './graphql/graphql.module';
import { DbModule } from './db/db.module';
import { KnexModule } from './knex/knex.module';
import { CryptModule } from './crypt/crypt.module';
import { WebrtcModule } from './webrtc/webrtc.module';

// initSequelize();

@Module({
  imports: [
    AuthModule,
    UserModule,
    GraphqlModule,
    DbModule,
    KnexModule,
    CryptModule,
    WebrtcModule,

    // SequelizeModule.forRoot({
    //   dialect: 'postgres',
    //   database: process.env.DATABASE_URL,
    //   models: getModels(),
    //   typeValidation: false,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
