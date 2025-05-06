import { WebSocket } from 'ws';
import { MessagePreview } from '../types/MessagePreview';

interface MessageBroadcast {
  type: 'message';
  payload: MessagePreview;
}

type RoomBroadcastData = MessageBroadcast;

class RoomManager {
  private rooms = new Map<string, Map<string, WebSocket>>();

  join(roomId: string, userId: string, ws: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    this.rooms.get(roomId)!.set(userId, ws);
  }

  leave(roomId: string, ws: WebSocket) {
    const room = this.rooms.get(roomId);

    if (room) {
      for (const [userId, socket] of room.entries()) {
        if (socket === ws) {
          room.delete(userId);
          break;
        }
      }

      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  broadcast(roomId: string, data: RoomBroadcastData) {
    const room = this.rooms.get(roomId);

    if (room) {
      for (const [, client] of room) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      }
    }
  }

  getSocket(roomId: string, userId: string): WebSocket | undefined {
    return this.rooms.get(roomId)?.get(userId);
  }
}

export const roomManager = new RoomManager();
