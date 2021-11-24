import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from '../db/db.module';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { JwtStrategy } from './jwt-strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const privateKey = process.env.AUTH_PRIVATE_KEY.toString().replace(
  /\\n/g,
  '\n',
);

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      privateKey,
      signOptions: {},
    }),
  ],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    {
      provide: 'dayjs',
      useValue: dayjs,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
