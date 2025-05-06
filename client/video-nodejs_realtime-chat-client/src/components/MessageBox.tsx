import { Message } from '../types/Message';

export const MessageBox = ({ message }: { message: Message }) => (
  <div className="box">
    <article className="media">
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{message.author.name}</strong>
            <br />
            <span>{message.text}</span>
          </p>

          <p className="has-text-grey-light is-size-7 has-text-right">
            <time dateTime={message.time}>{message.time}</time>
          </p>
        </div>
      </div>
    </article>
  </div>
);
