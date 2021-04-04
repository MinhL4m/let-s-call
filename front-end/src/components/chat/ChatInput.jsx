export const ChatInput = ({
  messageRef,
  sendMessage,
  onVideoCall,
  isEndCall,
  onEndCall,
}) => {
  return (
    <form className="chatroom-actions d-flex" onSubmit={sendMessage}>
      <input
        type="text"
        className="form-control"
        id="message-input"
        placeholder="Aa"
        ref={messageRef}
      />

      <input
        type="submit"
        name="submit"
        className="btn btn-md btn-outline-dark send-btn"
        value="Send"
      />
      {isEndCall ? (
        <input
          type="button"
          name="end"
          className="btn btn-md btn-outline-danger send-btn"
          value="End Call"
          onClick={onEndCall}
        />
      ) : (
        <input
          type="button"
          name="call"
          className="btn btn-md btn-outline-dark send-btn"
          value="Video Call"
          onClick={onVideoCall}
        />
      )}
    </form>
  );
};
