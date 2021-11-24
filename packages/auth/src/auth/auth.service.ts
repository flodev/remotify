import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import { DEFAULT_ROOM_NAME, REFRESH_TOKEN_EXPIRES_IN } from '../constants';
import { TokenService } from './token/token.service';
import { RefreshToken } from '@remotify/models';
import dayjs from 'dayjs';
import { TokenRepositoryService } from '../db/token-repository/token-repository.service';

const jwtKey = process.env.AUTH_PRIVATE_KEY.toString().replace(/\\n/g, '\n');

type DayJs = (
  date?: dayjs.ConfigType,
  format?: dayjs.OptionType,
  locale?: string,
  strict?: boolean,
) => dayjs.Dayjs;

@Injectable()
export class AuthService {
  private dayjs: DayJs;
  constructor(
    private tokenService: TokenService,
    private dbService: DbService,
    private tokenRepo: TokenRepositoryService,
    @Inject('dayjs') dayjs: DayJs,
  ) {
    this.dayjs = dayjs;
  }

  public async registerTemp() {
    const user = await this.dbService.registertemp();
    const token = await this.tokenService.generateAccessToken(
      user.id,
      user.username,
    );
    const refresh_token = await this.getRefreshToken(user.id);
    return {
      id: user.id,
      roomName: DEFAULT_ROOM_NAME,
      username: user.username,
      roles: this.getRoles(),
      token,
      refresh_token,
    };
  }

  public async registerViaInvite(inviteId: string) {
    const user = await this.dbService.registerViaInvite({
      inviteId,
    });
    const token = await this.tokenService.generateAccessToken(
      user.id,
      user.username,
    );
    const refresh_token = await this.getRefreshToken(user.id);
    return {
      id: user.id,
      roomName: DEFAULT_ROOM_NAME,
      username: user.username,
      roles: this.getRoles(),
      token,
      refresh_token,
    };
  }

  private async getRefreshToken(userId: string) {
    const refreshToken: RefreshToken = {
      user_id: userId,
      is_revoked: false,
      expired_at: this.dayjs()
        .utc()
        .add(parseInt(REFRESH_TOKEN_EXPIRES_IN, 10), 'day')
        .format('YYYY-MM-DD HH:mm:ss'),
    };
    console.log('refreshToken', refreshToken);
    const refreshTokenId = await this.tokenRepo.createRefreshToken(
      refreshToken,
    );
    return this.tokenService.generateRefreshToken(userId, refreshTokenId);
  }

  private getRoles() {
    return ['temp_user'];
  }
}
