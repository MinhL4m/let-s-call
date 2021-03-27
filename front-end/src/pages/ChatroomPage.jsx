import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export function ChatroomPage({socket}) {
  const [chatrooms, setChatrooms] = useState([]);
  // TODO add loading??

  useEffect(() => {
    async function getChatroom() {
      try {
        let res = await axios.get("http://localhost:3001/chatroom");
        setChatrooms(res.data);
      } catch (e) {
        console.log(e);
      }
    }

    getChatroom();
  }, []);

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
            {chatrooms.map((chatroom) => (
              <div key={chatroom._id} className="chatroom">
                <div>{chatroom.name}</div>
                <Link to={"/chat/" + chatroom._id}>
                  <div className="join">Join</div>
                </Link>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
