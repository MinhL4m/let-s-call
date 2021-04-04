import { useEffect } from "react";

export const VideoCall = ({
  callType,
  socket,
  chatroomId,
  localStream,
  setForceRerender,
}) => {
  let friendsVideo;

  useEffect(() => {
    let pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "webrtc",
          username: "websitebeaver@mail.com",
        },
      ],
    });
    friendsVideo = document.getElementById("remote");
    pc.onicecandidate = (event) => {
      event.candidate
        ? sendEstablishMessage({ ice: event.candidate })
        : console.log("Sent All Ice");
    };
    pc.onaddstream = (event) => (friendsVideo.srcObject = event.stream);
    socket.on("establishCall", function (message) {
      if (message.ice !== undefined)
        pc.addIceCandidate(new RTCIceCandidate(message.ice));
      // we want to join the offer
      else if (message.sdp.type === "offer")
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
          .then(() => pc.createAnswer())
          .then((answer) => pc.setLocalDescription(answer))
          .then(() => sendEstablishMessage({ sdp: pc.localDescription }));
      else if (message.sdp.type === "answer")
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    });
    document.getElementById("local").srcObject = localStream;
    pc.addStream(localStream);
    if (callType === "offer") {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => sendEstablishMessage({ sdp: pc.localDescription }));
    }
    return () => {
      pc.close();
      pc = null;
      localStream?.getTracks().forEach(function (track) {
        track.stop();
      });
      socket.off("establishCall");
      socket.emit("endCall", { chatroomId });
      setForceRerender();
    };
  }, []);

  function sendEstablishMessage(message) {
    socket.emit("establishCall", {
      chatroomId,
      socketId: socket.id,
      message,
    });
  }

  return (
    <div className="videocall">
      <div className="row">
        <div className="col-12 col-md-5 myVideo">
          <video id="local" autoPlay></video>
        </div>
        <div className="col-12 col-md-5 offset-md-2 friendVideo">
          <video id="remote" autoPlay></video>
        </div>
      </div>
    </div>
  );
};
