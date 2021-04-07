import axios from "axios";
import { useState, createRef } from "react";
import { useUserValue } from "../../context/user-provider";

export const FriendAdd = ({ addUser }) => {
  const [error, setError] = useState("");
  const idRef = createRef();
  const { user } = useUserValue();

  const onClick = async () => {
    const id = idRef.current.value;
    if (!id) {
      setError("Id cannot be empty");
    } else {
      try {
        const res = await axios.put("http://localhost:3001/friend/addfriend", {
          userId: user.id,
          friendId: id,
        });
        res ? addUser(res.data) : setError("Something went wrong");
      } catch (e) {
        if (e.response) {
          setError(e.response.data.message);
        } else {
          setError("Something went wrong");
        }
      }
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center ">Add Friend</h2>
      <p>Your Id: {user.id}</p>
      <div className="TypeAheadDropDown">
        <input placeholder="Friend Id" className="form-control" ref={idRef} />

        {error && (
          <small id="passwordHelp" className="text-danger">
            {error}
          </small>
        )}
        <div className="create-btn d-flex flex-row-reverse ">
          <input
            type="button"
            name="create"
            className="btn btn-md btn-outline-dark mt-3"
            value="Add"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};
