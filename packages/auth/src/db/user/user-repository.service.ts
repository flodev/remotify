import { Injectable } from '@nestjs/common';
import { Player } from '@remotify/models';
import { KnexService } from '../../knex/knex.service';

@Injectable()
export class UserRepositoryService {
  constructor(private knex: KnexService) {}

  public async getPlayerById(id: string): Promise<Player> {
    if (!id) {
      throw new Error('id is not defined');
    }
    return this.knex
      .getConnection()
      .select<Player>()
      .from('player')
      .where({ id })
      .first();
  }
}
