import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import {
  WebrtcConnection,
  RegisterSignal,
  WebrtcSignalEvents,
  WebrtcMessageTypes,
  GoneOfflineSignal,
} from '@remotify/models';
import { DbService } from '../db/db.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const rtcPort = parseInt(process.env.WEBRTC_PORT);
@WebSocketGateway(rtcPort, {
  cors: {
    methods: ['GET', 'POST'],
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Accept',
      'Origin',
      'Referer',
      'User-Agent',
    ],
    // credentials: true,
  },
})
export class WebrtcGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer() server: Server;

  constructor(private dbService: DbService) {}

  async handleDisconnect(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
  ) {
    console.log('client disconnect', client.data.id);
    if (client.data.id) {
      try {
        await this.dbService.setOnlineStatus(client.data.id, false);
        return true;
      } catch (e) {
        console.error('cannot go offline', e);
        return false;
      }
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('received a connection');
  }

  @SubscribeMessage(WebrtcSignalEvents.register)
  handleRegister(client: Socket, payload: RegisterSignal) {
    client.join(payload.id);
    client.data = {
      id: payload.id,
    };
    console.log('registered client', payload.id);
  }

  @SubscribeMessage(WebrtcSignalEvents.offer)
  handleOffer(
    client: Socket,
    payload: WebrtcConnection<WebrtcMessageTypes.offer>,
  ) {
    this.server.sockets
      .in(payload.receiverId)
      .emit(WebrtcSignalEvents.newOffer, payload);
  }

  @SubscribeMessage(WebrtcSignalEvents.candidate)
  handleCandidate(
    client: Socket,
    payload: WebrtcConnection<WebrtcMessageTypes.candidate>,
  ) {
    this.server.sockets
      .in(payload.receiverId)
      .emit(WebrtcSignalEvents.newCandidate, payload);
  }

  @SubscribeMessage(WebrtcSignalEvents.answer)
  handleAnswer(
    client: Socket,
    payload: WebrtcConnection<WebrtcMessageTypes.answer>,
  ) {
    this.server.sockets
      .in(payload.receiverId)
      .emit(WebrtcSignalEvents.newAnswer, payload);
  }
}
