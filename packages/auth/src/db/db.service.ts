import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@remotify/models';
import { Player } from '@remotify/models';
import { DEFAULT_ROOM_NAME } from '../constants';
import { CryptService } from '../crypt/crypt.service';
import { KnexService } from '../knex/knex.service';

@Injectable()
export class DbService {
  constructor(private knex: KnexService, private cryptoService: CryptService) {}

  public registertemp() {
    return this.knex.getConnection().transaction(async (trx) => {
      const [clientId] = await trx
        .insert({ name: 'temporary' })
        .into('client')
        .returning<string>('id');
      const hashId = this.cryptoService.hashUuid(clientId);

      const { id: spriteId } = await trx
        .select('id')
        .from('sprite')
        .where({ name: 'player' })
        .first();

      if (!spriteId) {
        throw new Error('player sprite not found');
      }

      await trx
        .update({ share_id: hashId })
        .table('client')
        .where({ id: clientId });
      const [roomId] = await trx
        .insert({ name: DEFAULT_ROOM_NAME, client_id: clientId })
        .returning<string[]>('id')
        .into('room');
      const [player] = await trx
        .insert({
          username: 'user1',
          lastname: 'temporary',
          firstname: 'temporary',
          password: 'temporary',
          sprite_id: spriteId,
          room_id: roomId,
        })
        .into('player')
        .returning<Player[]>('*');
      const { id: tempUserRoleId } = await trx
        .select('id')
        .from('role')
        .where({ name: 'temp_user' })
        .first();
      await trx
        .insert({ user_id: player.id, role_id: tempUserRoleId })
        .into('user_role');
      return { player, roomId };
    });
  }

  public setOnlineStatus(playerId: string, status: boolean) {
    return this.knex
      .getConnection()
      .update({ is_online: status })
      .from('player')
      .where({ id: playerId });
  }

  public registerViaInvite(values: { inviteId: string }) {
    return this.knex.getConnection().transaction(async (trx) => {
      const client = await trx
        .select('id')
        .from('client')
        .where({ share_id: values.inviteId })
        .first();
      if (!client || !client.id) {
        throw new Error('client not found');
      }

      const { id: spriteId } = await trx
        .select('id')
        .from('sprite')
        .where({ name: 'player' })
        .first();
      if (!spriteId) {
        throw new Error('player sprite not found');
      }
      const { id: roomId } = await trx
        .select('id')
        .from('room')
        .where({ client_id: client.id })
        .first();

      const username = await this.getUserName(roomId);

      const [player] = await trx
        .insert({
          username,
          lastname: 'temporary',
          firstname: 'temporary',
          password: 'temporary',
          room_id: roomId,
          sprite_id: spriteId,
          client_share_id: values.inviteId,
        })
        .into('player')
        .returning<Player[]>('*');
      const { id: tempUserRoleId } = await trx
        .select('id')
        .from('role')
        .where({ name: 'temp_user' })
        .first();
      await trx
        .insert({ user_id: player.id, role_id: tempUserRoleId })
        .into('user_role');
      return { player, roomId };
    });
  }

  private async getUserName(roomId: string) {
    const count = await this.knex
      .getConnection()
      .table('player')
      .count('*')
      .where({ room_id: roomId })
      .first<{ count: string }>();

    const number = parseInt(count.count, 10);
    return `user${number + 1}`;
  }
}
