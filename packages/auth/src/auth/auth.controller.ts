import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TokenRepositoryService } from '../db/token-repository/token-repository.service';
import { UserRepositoryService } from '../db/user/user-repository.service';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { RefreshToken, TempSignup } from './validation';

@Controller('auth')
export class AuthController {
  constructor(
    private tokenService: TokenService,
    private tokenRepo: TokenRepositoryService,
    private userRepo: UserRepositoryService,
    private authService: AuthService,
  ) {}

  @Post('temp-signup')
  async postTempSignup(@Body() tempSignup: TempSignup) {
    console.log('temp signup');
    try {
      if (tempSignup.type === 'invitation') {
        const response = await this.authService.registerViaInvite(
          tempSignup.inviteId,
        );
        return response;
      } else if (tempSignup.type === 'temporary') {
        const response = await this.authService.registerTemp();
        return response;
      } else {
        throw new Error('unknown register type ' + tempSignup.type);
      }
    } catch (err) {
      console.log('cannot register', err);
      return { error: 500 };
    }
  }

  @Post('/refresh-token')
  public async refresh(@Body() body: RefreshToken) {
    const {
      sub: userId,
      jti: tokenId,
      ...rest
    } = await this.tokenService.decodeRefreshToken(body.refreshToken);
    console.log(userId, tokenId);
    console.log('mort', rest);

    if (!userId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }
    const refreshToken = await this.tokenRepo.getTokenById(tokenId);

    if (!refreshToken) {
      throw new UnprocessableEntityException('Refresh refreshToken not found');
    }

    if (refreshToken.is_revoked) {
      throw new UnprocessableEntityException('Refresh refreshToken revoked');
    }

    const user = await this.userRepo.getPlayerById(refreshToken.user_id);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    const accessToken = await this.tokenService.generateAccessToken(
      user.id,
      user.username,
    );

    return {
      token: accessToken,
    };
  }
}
