import { useEffect, useState, createRef } from "react";
import { useUserValue } from "../context/user-provider";
import axios from "axios";
import "../styles/chatPage.css";
import { ChatBubble } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { useHookWithRefCallback } from "../hooks/useHookWithRefCallBack";

export const ChatPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const { user } = useUserValue();
  let observer = null;

  const messageRef = createRef(null);
  const [messages, setMessages] = useState([]);

  const scrollToBottom = (node) => {
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [bottomRef] = useHookWithRefCallback({ callback: scrollToBottom });

  const [topRef] = useHookWithRefCallback({
    // Closure trap the messages state as the beginning messages state
    // create closure to use tempMessages to keep track of the message state
    callback: (node) => {
      if (node) {
        observer = new IntersectionObserver(
          (() => {
            let tempMessages = messages;
            let isReachLastMessage = false;
            let isFetching = false;
            return async () => {
              if (!isReachLastMessage && !isFetching) {
                const newMessages = await fetchMessageOnTop(
                  tempMessages,
                  isReachLastMessage,
                  isFetching
                );
                isReachLastMessage = newMessages?.data?.length ?? 0 !== 10;
                tempMessages = [
                  ...(newMessages?.data?.reverse() ?? []),
                  ...(tempMessages ?? []),
                ];
                setMessages(tempMessages);
                isFetching = false;
              }
            };
          })(),
          observerOptions
        );
        if (node) observer.observe(node);
      }
    },
    cleanup: (node) => {
      if (node && observer) observer.unobserve(node);
    },
  });

  const observerOptions = {
    root: null,
    rootMargin: "-20px",
    threshold: 1,
  };

  const sendMessage = (e) => {
    e.preventDefault();
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
      socket.on("newMessage", ({ message }) => {
        console.log("here");
        setMessages([...(messages ?? []), message]);
      });
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { chatroomId });
    }

    fetchMessage(true);

    return () => {
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId,
        });
      }
    };
  }, []);

  const fetchMessage = async (first = false) => {
    let lastDate = first ? new Date() : messages[0].createdAt;

    try {
      const newMessages = await axios.get("http://localhost:3001/message", {
        params: {
          roomId: chatroomId,
          lastDate: lastDate,
        },
      });
      setMessages([...(newMessages.data.reverse() ?? []), ...(messages ?? [])]);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchMessageOnTop = async (messages, isFetching) => {
    let lastDate = messages[0]?.createdAt ?? new Date();
    isFetching = true;
    try {
      return await axios.get("http://localhost:3001/message", {
        params: {
          roomId: chatroomId,
          lastDate: lastDate,
        },
      });
    } catch (e) {
      console.log(e);
      isFetching = true;
    }
  };

  return (
    <div className="container">
      <div className="fetch-new" ref={topRef}></div>
      <div className="messages">
        {messages?.length > 0 &&
          messages.map((message, i) => {
            return (
              <ChatBubble
                key={message._id}
                message={message}
                user={user}
                lastRef={i === messages.length - 1 ? bottomRef : null}
              />
            );
          })}
      </div>
      <ChatInput messageRef={messageRef} sendMessage={sendMessage} />
    </div>
  );
};
