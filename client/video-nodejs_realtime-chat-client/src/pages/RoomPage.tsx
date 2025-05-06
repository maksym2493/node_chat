import cn from 'classnames';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Room } from '../types/Room';
import { Message } from '../types/Message';
import { roomService } from '../services/roomService';
import { messageService } from '../services/messageService';
import { accessTokenService } from '../services/accessTokenService';

import { Loader } from '../components/Loader';
import { MessageList } from '../components/MessageList';
import { MessageForm } from '../components/MessageForm';
import { RoomNameForm } from '../components/RoomNameForm';

interface WssMessage {
  type: 'message';
  payload: Message;
}

interface WssRoomChanged {
  type: 'name_changed';
  payload: string;
}

type WssData = WssMessage | WssRoomChanged;

export const RoomPage = () => {
  const params = useParams();
  const id = params.id!;

  const navigate = useNavigate();
  const location = useLocation();
  const stateRoom = location.state as Room | undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<Room | null>(stateRoom ?? null);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const join = useCallback(
    (id: string) => {
      roomService
        .join(id)
        .then(data => {
          setRoom({
            ...data,
            creator: false,
          });
        })
        .catch(() => navigate('/', { replace: true }));
    },
    [navigate],
  );

  const loadMessages = useCallback(
    (id: string) => {
      messageService
        .getAll(id)
        .then(loadedMessages => {
          setMessages(current => [...current, ...loadedMessages]);
          setIsLoading(false);
        })
        .catch(async (err: AxiosError) => {
          if (err.response?.status === 403) {
            join(id);

            return;
          }

          await navigate('/', { replace: true });
        });
    },
    [join, navigate],
  );

  useEffect(() => {
    if (stateRoom) return;

    roomService
      .get(id)
      .then(setRoom)
      .catch(async (err: AxiosError) => {
        if (err.response?.status === 403) {
          join(id);

          return;
        }

        await navigate('/', { replace: true });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (room && isLoading) {
      loadMessages(room.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (isLoading || !room) return;

    const accessToken = accessTokenService.get();
    const socket = new WebSocket(
      `ws://localhost:3000?accessToken=${accessToken}&roomId=${room.id}`,
    );

    socket.addEventListener('message', (event: { data: string }) => {
      const { type, payload } = JSON.parse(event.data) as WssData;

      console.log(type, payload);

      switch (type) {
        case 'message':
          return setMessages(curr => [payload, ...curr]);

        case 'name_changed':
          return setRoom(curr => (curr ? { ...curr, name: payload } : null));
      }
    });

    socket.addEventListener('close', ev => {
      if (ev.code === 4002) {
        void navigate('/', { replace: true });
      }
    });

    return () => socket.close();
  }, [isLoading, navigate, room]);

  const handleRemove = useCallback(() => {
    const { id, creator } = room!;
    const action = creator ? roomService.delete : roomService.leave;

    setIsRemoving(true);

    action(id)
      .then(() => navigate('/'))
      .catch(() => {})
      .finally(() => setIsRemoving(false));
  }, [navigate, room]);

  if (!room || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="box">
        <h1 className="title">
          {room.name}
          <button
            type="submit"
            className="button is-success has-text-weight-bold ml-2"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => navigate('/')}
          >
            Back to rooms
          </button>

          {room.creator && (
            <button
              type="submit"
              className={cn('button is-success has-text-weight-bold ml-2', {
                'is-danger': isFormVisible,
              })}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => setIsFormVisible(!isFormVisible)}
            >
              {isFormVisible ? 'Cancel' : 'Change name'}
            </button>
          )}

          <button
            className={cn('button is-danger ml-2', {
              'is-loading': isRemoving,
            })}
            onClick={handleRemove}
          >
            {room.creator ? 'Delete Room' : 'Leave Room'}
          </button>
        </h1>

        {isFormVisible ? (
          <RoomNameForm
            id={room.id}
            name={room.name}
            onChange={() => setIsFormVisible(false)}
          />
        ) : (
          <MessageForm roomId={room.id} />
        )}
      </div>

      {messages.length !== 0 ? (
        <MessageList messages={messages} />
      ) : (
        <div className="box">No messages yet</div>
      )}
    </>
  );
};
