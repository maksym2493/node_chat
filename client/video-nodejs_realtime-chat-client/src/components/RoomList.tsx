import React from 'react';
import { RoomBox } from './RoomBox';
import { Room } from '../types/Room';

interface Props {
  rooms: Room[];
  onDelete: (id: string) => void;
}

export const RoomList: React.FC<Props> = ({ rooms, onDelete }) => (
  <>
    {rooms.map(room => (
      <RoomBox room={room} onDelete={onDelete} key={room.id} />
    ))}
  </>
);
