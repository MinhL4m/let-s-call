import { timeSince } from "../../helpers/timeHelper";

export const ChatBubble = ({ user, message, lastRef }) => {
  return (
    <>
      <div
        className={`msg-list ${user.id === message.user ? "sender" : ""}`}
        ref={lastRef}
      >
        <div className="messenger-container">
          <small
            className={`name ${
              user.id !== message.user ? "text-left" : "text-right"
            }`}
          >
            {message.name.split(" ")[0]}
          </small>
          <p>{message.message}</p>
          <small
            className={`time ${
              user.id !== message.user ? "text-right" : "text-right"
            }`}
          >
            {timeSince(Date.parse(message.createdAt))}
          </small>
        </div>
      </div>
      <div className="clear"></div>
    </>
  );
};
