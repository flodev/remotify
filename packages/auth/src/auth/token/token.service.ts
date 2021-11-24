import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../../constants';

export interface RefreshTokenPayload {
  jti: string;
  sub: string;
}

const jwtKey = process.env.AUTH_PRIVATE_KEY.toString().replace(/\\n/g, '\n');

@Injectable()
export class TokenService {
  public constructor(private jwtService: JwtService) {}

  public async generateAccessToken(
    userId: string,
    username: string,
  ): Promise<string> {
    const claim = {
      name: username,
      // iat: Math.floor(Date.now() / 1000),
      'https://hasura.io/jwt/claims': this.getHasuraClaims(userId),
    };

    return this.jwtService.sign(claim, {
      privateKey: jwtKey,
      subject: userId,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      algorithm: 'RS256',
    });
  }

  public async generateRefreshToken(
    userId: string,
    refreshTokenId: string,
  ): Promise<string> {
    const opts: JwtSignOptions = {
      privateKey: jwtKey,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      subject: userId,
      jwtid: refreshTokenId,
      algorithm: 'RS256',
    };

    return this.jwtService.sign({}, opts);
  }

  public async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: jwtKey,
        algorithms: ['RS256'],
      });
    } catch (e) {
      console.error('decode refresh token error', e);
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private getHasuraClaims(id: string) {
    return {
      'x-hasura-allowed-roles': this.getRoles(),
      'x-hasura-default-role': 'temp_user',
      'x-hasura-user-id': `${id}`,
      // 'x-hasura-org-id': '123',
      // 'x-hasura-custom': 'custom-value'
    };
  }

  private getRoles() {
    return ['temp_user'];
  }
}
