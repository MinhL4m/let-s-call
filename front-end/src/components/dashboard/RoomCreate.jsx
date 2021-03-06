import axios from "axios";
import { useUserValue } from "../../context/user-provider";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import { useState } from "react";
import "../../styles/roomCreate.css";

export const RoomCreate = ({ setChatrooms }) => {
  /**Debounce Search */
  const { user } = useUserValue();

  const searchForFriends = async (text) =>
    await axios.get("http://localhost:3001/friend/by-name", {
      params: { userId: user.id, name: text },
    });

  const useSearchUser = () =>
    useDebouncedSearch((text) => searchForFriends(text));

  const { setInputText, searchResults } = useSearchUser();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const createRoom = async () => {
    setInput("");
    setError("");
    try {
      const res = await axios.post("http://localhost:3001/chatroom", {
        userId: user.id,
        userName: user.name,
        friendString: input,
      });
      if (res.data.new) {
        setChatrooms(res.data.room);
      } else {
        setError("Room existed");
      }
    } catch (e) {
      if (e.response) {
        setError(e.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center ">Create Room</h2>
      <div className="TypeAheadDropDown">
        <input
          value={input}
          placeholder="Friend Name;Friend email"
          onChange={(e) => {
            setInput(e.target.value.trim());
            setInputText(e.target.value.trim());
          }}
          className="form-control"
        />
        <div className="suggest-container">
          {error && (
            <small id="passwordHelp" className="text-danger">
              {error}
            </small>
          )}
          <div className="create-btn d-flex flex-row-reverse ">
            <input
              type="button"
              name="create"
              onClick={createRoom}
              className="btn btn-md btn-outline-dark mt-3"
              value="Create"
            />
          </div>
          {searchResults.result && (
            <ul>
              {searchResults.result?.data?.map((friend) => (
                <li
                  key={friend._id}
                  className="list-group-item"
                  onClick={(e) => {
                    setInput(`${friend.name};${friend.email}`);
                    setInputText("");
                  }}
                >
                  {`${friend.name};${friend.email}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
