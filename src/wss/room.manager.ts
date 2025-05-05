import { WebSocket } from 'ws';
import { MessagePreview } from '../types/MessagePreview';

interface MessageBroadcast {
  type: 'message';
  payload: MessagePreview;
}

type RoomBroadcastData = MessageBroadcast;

class RoomManager {
  private rooms = new Map<string, Set<WebSocket>>();

  join(roomId: string, ws: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId)!.add(ws);
  }

  leave(roomId: string, ws: WebSocket) {
    const room = this.rooms.get(roomId);

    if (room) {
      room.delete(ws);

      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  broadcast(roomId: string, data: RoomBroadcastData) {
    const room = this.rooms.get(roomId);

    if (room) {
      for (const client of room) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      }
    }
  }
}

export const roomManager = new RoomManager();
