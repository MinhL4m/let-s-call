export function ChatroomPage() {
  return (
    <div className="card">
      <div className="card--header">Create Room</div>
      <div className="card--body">
        <form className="card--form">
          <div className="card--input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              className="card--name"
              placeholder="My Room"
            />
          </div>
          <button>Create Room</button>
          <div className="chatrooms">
            <div className="chatroom">
              <div>Testing</div>
              <div className="join">Join</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
