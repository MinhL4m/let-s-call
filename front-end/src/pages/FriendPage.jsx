import { useState, useEffect } from "react";
import { useUserValue } from "../context/user-provider";
import { Link } from "react-router-dom";
import axios from "axios";
import { FriendAdd } from "../components/dashboard/FriendAdd";
export function FriendPage({ socket }) {
  const [friends, setFriends] = useState([]);
  const { user } = useUserValue();

  useEffect(() => {
    async function getChatroom() {
      console.log(user);
      try {
        let res = await axios.get("http://localhost:3001/friend", {
          params: { userId: user.id },
        });

        setFriends(res.data);
      } catch (e) {}
    }

    getChatroom();
  }, []);

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
              <Link to={"/chat/" + friend._id}>
                <div className="join">Join</div>
              </Link>
            </li>
          ))}
      </ul>
      {friends.length === 0 && <p class="text-center mt-3">Not friend found</p>}
    </div>
  );
}
