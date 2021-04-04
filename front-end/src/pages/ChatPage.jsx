import { useEffect, useState, createRef } from "react";
import { useUserValue } from "../context/user-provider";
import axios from "axios";
import "../styles/chatPage.css";
import { ChatBubble } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { useHookWithRefCallback } from "../hooks/useHookWithRefCallBack";
import { Modal } from "../components/common/Modal";
import { VideoCall } from "../components/chat/VideoCall";

export const ChatPage = ({ match, socket }) => {
  const chatroomId = match.params.id;
  const { user } = useUserValue();
  let observer = null;

  const messageRef = createRef(null);
  const [messages, setMessages] = useState([]);
  const [modalType, setModalType] = useState("");
  const [callType, setCallType] = useState("");
  const [stream, setStream] = useState(null);

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
                isReachLastMessage = (newMessages?.data?.length ?? 0) !== 10;
                tempMessages = [
                  ...(newMessages?.data?.reverse() ?? []),
                  ...(tempMessages ?? []),
                ];
                setMessages(tempMessages);
                window.scrollBy(0, window.innerHeight / 25);
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
      socket.on("receiveCall", () => {
        setModalType("receiveCall");
      });

      socket.on("denyCall", () => {
        setModalType("denyCall");
        setCallType("");
      });

      socket.on("endCall", () => {
        setModalType("endCall");
        setCallType("");
        stream?.getTracks().forEach(function (track) {
          track.stop();
        });
      });
      socket.on("noPermission", () => {
        setModalType("noPermission");
        setCallType("");
      });

      socket.on("otherNotInRoom", () => {
        setModalType("otherNotInRoom");
        setCallType("");
      });
    }
    return () => {
      if (socket) {
        socket.off("receiveCall");
        socket.off("endCall");
        socket.off("denyCall");
        socket.off("noPermission");
        socket.off("otherNotInRoom");
      }
    };
  }, [callType]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", { chatroomId });
    }

    fetchMessage(true);

    return () => {
      if (socket) {
        if (callType) socket.emit("endCall", chatroomId);
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

  const modalContent = () => {
    switch (modalType) {
      case "receiveCall":
        return "You receive call from other user";
      case "endCall":
        return "Call End";
      case "otherNotInRoom":
        return "Other user is not in room";
      case "noPermission":
        return "Please make sure you and your friend turn on Camera and Microphone";
      default:
        return "Other user denied your call";
    }
  };

  const modalTitle = () => {
    switch (modalType) {
      case "receiveCall":
        return "Receive Call";
      case "endCall":
        return "Call End";
      case "otherNotInRoom":
        return "Information";
      case "noPermission":
        return "Permission";
      default:
        return "Deny Call";
    }
  };

  const modalButton = () => {
    switch (modalType) {
      case "receiveCall":
        return "Accept";
      default:
        return "Ok";
    }
  };

  return (
    <div className="container">
      {modalType && (
        <Modal
          content={modalContent()}
          onAccept={() => {
            navigator.mediaDevices
              .getUserMedia({
                audio: true,
                video: true,
              })
              .then((stream) => {
                setStream(stream);
                if (modalType === "receiveCall") setCallType("offer");
                setModalType("");
              })
              .catch(function (e) {
                // TODO: set modal as need permission
                socket.emit("noPermission", { chatroomId });
              });
          }}
          onClose={() => {
            if (modalType === "receiveCall")
              socket.emit("denyCall", { chatroomId, socketId: socket.id });
            setModalType("");
          }}
          title={modalTitle()}
          hasClose={modalType === "receiveCall"}
          acceptButton={modalButton()}
        />
      )}
      {callType && stream && (
        <VideoCall
          callType={callType}
          socket={socket}
          chatroomId={chatroomId}
          localStream={stream}
        />
      )}
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
      <ChatInput
        messageRef={messageRef}
        sendMessage={sendMessage}
        onVideoCall={() => {
          navigator.mediaDevices
            .getUserMedia({
              audio: true,
              video: true,
            })
            .then((stream) => {
              setCallType("answer");
              setStream(stream);
              // setForceRerender(!forceRerender);
              socket.emit("startCall", { chatroomId, socketId: socket.id });
            })
            .catch(function (e) {
              // TODO: set modal as need permission
            });
        }}
        onEndCall={() => {
          setCallType("");
        }}
        isEndCall={callType}
      />
    </div>
  );
};
