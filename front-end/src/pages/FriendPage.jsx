import { useState, useEffect } from "react";
import { useUserValue } from "../context/user-provider";
import { useHistory, withRouter } from "react-router-dom";
import axios from "axios";
import { FriendAdd } from "../components/dashboard/FriendAdd";
function FriendPage() {
  const [friends, setFriends] = useState([]);
  const { user } = useUserValue();
  const history = useHistory();

  useEffect(() => {
    async function getChatroom() {
      try {
        let res = await axios.get("http://localhost:3001/friend", {
          params: { userId: user.id },
        });

        setFriends(res.data);
      } catch (e) {}
    }

    getChatroom();
  }, []);

  const onChat = async (friendName, friendId) => {
    try {
      const res = await axios.post("http://localhost:3001/chatroom", {
        userId: user.id,
        friendId,
        userName: user.name,
        friendName,
      });

      history.push(`/chat/${res.data.room._id}`);
    } catch (e) {
      //TODO Modal pop up
    }
  };

  return (
    <div className="container">
      <FriendAdd addUser={(friend) => setFriends([...friends, friend])} />
      <hr />
      <h2 className="text-center ">List Friend</h2>
      <ul className="list-group list-group-flush">
        {friends.length > 0 &&
          friends.map((friend) => (
            <li
              key={friend._id}
              className="list-group-item d-flex d-flex justify-content-between"
            >
              <div>{friend.name}</div>
              <input
                type="button"
                name="chat"
                className="btn btn-md btn-outline-dark"
                value="Chat"
                onClick={() => onChat(friend.name, friend._id)}
              />
            </li>
          ))}
      </ul>
      {friends.length === 0 && (
        <p className="text-center mt-3">Not friend found</p>
      )}
    </div>
  );
}

export default withRouter(FriendPage);
