import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@remotify/models';
import { KnexService } from '../../knex/knex.service';

@Injectable()
export class TokenRepositoryService {
  constructor(private knex: KnexService) {}

  public async createRefreshToken(refreshToken: RefreshToken) {
    const [refreshTokenId] = await this.knex
      .getConnection()
      .insert(refreshToken)
      .into('refresh_token')
      .returning('id');
    console.log('refreshTokenId', refreshTokenId);
    return refreshTokenId;
  }

  public async getTokenById(tokenId: string) {
    const refreshToken = await this.knex
      .getConnection()
      .select()
      .from('refresh_token')
      .returning<RefreshToken>('*')
      .where({ id: tokenId })
      .first();
    console.log('refreshToken', refreshToken);
    return refreshToken;
  }
}
