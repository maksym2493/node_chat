import React, { memo } from 'react';
import { Message } from '../types/Message';
import { MessageBox } from './MessageBox';

interface Props {
  messages: Message[];
}

const messageList: React.FC<Props> = ({ messages }) => {
  console.log(messages.length);
  return (
    <div className="message-list">
      {messages.map(message => (
        <MessageBox message={message} key={message.id} />
      ))}
    </div>
  );
};

export const MessageList = memo<Props>(messageList);
