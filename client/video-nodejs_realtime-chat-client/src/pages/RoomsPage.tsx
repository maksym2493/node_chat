import { useCallback, useEffect, useMemo, useState } from 'react';

import { Room } from '../types/Room';
import { roomService } from '../services/roomService';

import { Loader } from '../components/Loader';
import { RoomList } from '../components/RoomList';
import { RoomForm } from '../components/RoomForm';

export const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    roomService
      .getAll()
      .then(setRooms)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.time).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.time).getTime() : 0;

      return timeB - timeA;
    });
  }, [rooms]);

  const handleDelete = useCallback(
    (id: string) => setRooms(curr => curr.filter(room => room.id !== id)),
    [],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <RoomForm />

      {rooms.length ? (
        <RoomList rooms={sortedRooms} onDelete={handleDelete} />
      ) : (
        <div className="box">Choose a room to join or create a new one!</div>
      )}
    </>
  );
};
