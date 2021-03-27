import { useEffect, useState, createRef } from "react";
import { useUserValue } from "../context/user-provider";

export const ChatPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const { user } = useUserValue();
  const [messages, setMessages] = useState([]);

  const messageRef = createRef();

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });

      messageRef.current.value = "";
    }
  };

  /**
   * Need messages dependency
   * If don't use dependency, messages state will be encapsulate inside the closure and won't match the current state value
   */
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        setMessages([...messages, message]);
      });
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { chatroomId });
    }

    return () => {
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
  }, []);

  return (
    <div className="charoomPage">
      <div className="chatroom--section">
        <div className="chatroom--header">Chatroom Name</div>
        <div className="chatroom--content">
          {/* <div className="message">
            <span className="otherMessage">ABC:</span> Yo
          </div>
          <div className="message">
            <span className="ownMessage">You:</span> Sup
          </div> */}
          {messages.map((message, i) => {
            return (
              <div key={i} className="message">
                <span
                  className={
                    user._id === message.userId ? "ownMessage" : "otherMessage"
                  }
                >
                  {message.name}:
                </span>{" "}
                {message.message}
              </div>
            );
          })}
        </div>
        <div className="chatroom--actions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Type here"
              ref={messageRef}
            />
          </div>
          <div>
            <button className="send" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
