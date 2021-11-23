import { Module } from '@nestjs/common';
import { CryptModule } from '../crypt/crypt.module';
import { KnexModule } from '../knex/knex.module';
import { DbService } from './db.service';
import { UserRepositoryService } from './user/user-repository.service';
import { TokenRepositoryService } from './token-repository/token-repository.service';

@Module({
  imports: [KnexModule, CryptModule],
  providers: [DbService, UserRepositoryService, TokenRepositoryService],
  exports: [DbService, UserRepositoryService, TokenRepositoryService],
})
export class DbModule {}
