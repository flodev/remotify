import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Player } from '@remotify/models';
import { UserRepositoryService } from '../../db/user/user-repository.service';

export interface AccessTokenPayload {
  sub: string;
}
const secretOrKey = process.env.AUTH_PRIVATE_KEY.toString().replace(
  /\\n/g,
  '\n',
);
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private userRepo: UserRepositoryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      signOptions: {},
    });
  }

  async validate(payload: AccessTokenPayload): Promise<Player> {
    const { sub: id } = payload;

    const user = await this.userRepo.getPlayerById(id);

    if (!user) {
      return null;
    }

    return user;
  }
}
