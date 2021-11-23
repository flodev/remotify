import { Module } from '@nestjs/common';
import { KnexService } from './knex.service';

@Module({
  providers: [KnexService],
  exports: [KnexService],
})
export class KnexModule {}
