import { messageEmitter } from '../emitters/message.emitter';
import { roomManager } from './room.manager';

export function addListeners() {
  messageEmitter.on('message', (data) => {
    const { roomId, preview } = data;

    roomManager.broadcast(roomId, {
      type: 'message',
      payload: preview,
    });
  });
}
