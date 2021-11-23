import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { connect } from 'socket.io-client';
import { WebrtcSignalEvents } from '@remotify/models';
import { WebrtcConnection } from '@remotify/models';
import { WebrtcMessageTypes } from '@remotify/models';

xdescribe('AppController (e2e)', () => {
  let app: INestApplication;
  const host = `ws://localhost:${process.env.WEBRTC_PORT}`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(process.env.WEBRTC_PORT);
  });

  it('webrtc socket test', (done) => {
    const socket = connect(host, {
      forceNew: true,
    });
    socket.emit(WebrtcSignalEvents.register, { id: '1235' });
    const offer: WebrtcConnection<WebrtcMessageTypes.offer> = {
      message: {
        type: 'offer',
        sdp: 'sdfsdf',
      },
      receiverId: '1235',
      senderId: '4343',
      type: WebrtcMessageTypes.offer,
    };
    socket.emit(WebrtcSignalEvents.offer, offer);
    socket.on(
      WebrtcSignalEvents.newOffer,
      (offer: WebrtcConnection<WebrtcMessageTypes.offer>) => {
        expect(offer.receiverId).toEqual('1235');
        done();
      },
    );
  });
});
