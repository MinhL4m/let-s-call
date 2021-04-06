import { useState, useEffect } from "react";
import { useUserValue } from "../context/user-provider";
import { Link } from "react-router-dom";
import axios from "axios";
import { RoomCreate } from "../components/dashboard/RoomCreate";
export function ChatroomPage() {
  const [chatrooms, setChatrooms] = useState([]);
  const { user } = useUserValue();

  useEffect(() => {
    async function getChatroom() {
      try {
        let res = await axios.get("http://localhost:3001/chatroom", {
          params: { userId: user.id },
        });
        setChatrooms(res.data);
      } catch (e) {}
    }

    getChatroom();
  }, []);

  return (
    <div className="container">
      <RoomCreate />
      <hr />
      <h2 className="text-center ">List Room</h2>
      <ul className="list-group list-group-flush">
        {chatrooms.length > 0 &&
          chatrooms.map((chatroom) => (
            <li
              key={chatroom._id}
              className="list-group-item d-flex d-flex justify-content-between"
            >
              <div>{chatroom.name}</div>
              <Link to={"/chat/" + chatroom._id}>
                <div className="join">Join</div>
              </Link>
            </li>
          ))}
      </ul>
      {chatrooms.length === 0 && <p className="text-center mt-3">Not room found</p>}
    </div>
  );
}
