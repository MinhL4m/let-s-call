import { useState, useEffect } from "react";
import { useUserValue } from "../context/user-provider";
import { useHistory, withRouter } from "react-router-dom";
import axios from "axios";
import { FriendAdd } from "../components/dashboard/FriendAdd";
import { Modal } from "../components/common/Modal";
function FriendPage() {
  const [friends, setFriends] = useState([]);
  const [isError, setIsError] = useState(false);
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
      setIsError(true);
    }
  };

  const unFriend = async (friendId) => {
    try {
      const res = await axios.put("http://localhost:3001/friend/unfriend", {
        userId: user.id,
        friendId,
      });

      if (res.data) {
        const newList = friends.filter((ele) => ele._id !== friendId);
        setFriends(newList);
      }
    } catch (e) {
      setIsError(true);
    }
  };

  return (
    <div className="container">
      {isError && (
        <Modal
          content="Something thing went wrong"
          onClose={() => {
            setIsError(false);
          }}
          title="Error"
          onAccept={() => {
            setIsError(false);
          }}
        />
      )}
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
              <div>
                <input
                  type="button"
                  name="chat"
                  className="btn btn-md btn-outline-dark"
                  value="Chat"
                  onClick={() => onChat(friend.name, friend._id)}
                />
                <input
                  type="button"
                  name="remove"
                  className="btn btn-md btn-outline-danger send-btn"
                  value="Unfriend"
                  onClick={() => unFriend(friend._id)}
                />
              </div>
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
