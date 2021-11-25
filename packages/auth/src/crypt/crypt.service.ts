import { Injectable } from '@nestjs/common';
// const INIT_NUMBER = 271;
import crypto from 'crypto';
@Injectable()
export class CryptService {
  public hashUuid(uuid: string) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(uuid);
    return md5sum.digest('base64');
  }
}
