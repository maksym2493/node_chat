import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useState } from 'react';

import { MessageBox } from './MessageBox';

import { Room } from '../types/Room';
import { roomService } from '../services/roomService';

interface Props {
  room: Room;
  onDelete: (id: string) => void;
}

export const RoomBox: React.FC<Props> = ({ room, onDelete }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id, name, creator, lastMessage } = room;

  const leaveChat = useCallback(
    (e: React.MouseEvent) => {
      setIsLoading(true);
      e.stopPropagation();

      roomService
        .leave(id)
        .then(() => onDelete(id))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    },
    [id, onDelete],
  );

  return (
    <article
      className="message mb-4"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => navigate(`/${id}`, { state: room })}
    >
      <div className="message-header">
        <p>{name}</p>
        {!creator && (
          <button
            className={cn('button delete is-large', {
              'is-loading': isLoading,
            })}
            aria-label="delete"
            onClick={leaveChat}
          ></button>
        )}
      </div>
      <div className="message-body">
        {lastMessage ? <MessageBox message={lastMessage} /> : 'No messages yet'}
      </div>
    </article>
  );
};
