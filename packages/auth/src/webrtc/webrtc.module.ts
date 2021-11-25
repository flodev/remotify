import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { WebrtcGateway } from './webrtc.gateway';

@Module({
  providers: [WebrtcGateway],
  imports: [DbModule],
})
export class WebrtcModule {}
