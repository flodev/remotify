import { Test, TestingModule } from '@nestjs/testing';
import { WebrtcGateway } from './webrtc.gateway';

describe('WebrtcGateway', () => {
  let gateway: WebrtcGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebrtcGateway],
    }).compile();

    gateway = module.get<WebrtcGateway>(WebrtcGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
