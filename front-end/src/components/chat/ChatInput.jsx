export const ChatInput = ({ messageRef, sendMessage }) => {
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
    </form>
  );
};
