import { Injectable } from '@nestjs/common';
import { knex } from '../../db/schema';

@Injectable()
export class KnexService {
  getConnection() {
    return knex;
  }
}
