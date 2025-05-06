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

  messageEmitter.on('leave', (data) => {
    const { roomId, userId } = data;
    const ws = roomManager.getSocket(roomId, userId);

    ws?.close(4001, 'You have left the room');
  });
}
