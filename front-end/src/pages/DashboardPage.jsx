import "../styles/dashboardPage.css";
import { useEffect, useState } from "react";
import { useUserValue } from "../context/user-provider";
import { Link, Route, withRouter } from "react-router-dom";
import { ChatroomPage } from "./ChatroomPage";
import { FriendPage } from "./FriendPage";
import { ChatPage } from "./ChatPage";
import { subscribeUser, unsubscribeUser } from "../helpers/notificationHelper";
import io from "socket.io-client";

function DashboardPage({ history }) {
  const { user, setUser } = useUserValue();
  const [isConnecting, setIsConnecting] = useState(true);
  const [socket, setSocket] = useState(null);
  let timeout = null;

  /**
   * Setup socket
   */
  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token") ?? "";

    // has token and hasn't connect to socket
    if (token.length > 0 && !socket) {
      const newSocket = io("http://localhost:3001", {
        transports: ["websocket"],
        query: {
          token: token,
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        timeout = setTimeout(setupSocket, 30000);
        console.log("cannot connect socket");
      });

      newSocket.on("connect", () => {
        console.log("sucess connect socket");
        setIsConnecting(false);
        if (timeout) {
          clearTimeout(timeout);
        }
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  const toggleSideBar = () => {
    const wrapper = document.querySelector("#wrapper");
    wrapper.classList.contains("toggled")
      ? wrapper.classList.remove("toggled")
      : wrapper.classList.add("toggled");
  };

  useEffect(() => {
    subscribeUser(user.id);
  }, []);

  const logout = (e) => {
    e.preventDefault();
    unsubscribeUser(user.id);
    setUser(null);
    localStorage.removeItem("CC_Token");
    socket.close();
    history.replace("/login");
    return false;
  };

  return (
    <div className="d-flex" id="wrapper">
      <div className="bg-light border-right" id="sidebar-wrapper">
        <div className="sidebar-heading">Hello, {user.name.split(" ")[0]}</div>
        <div className="list-group list-group-flush">
          <Link
            to="/rooms"
            className="list-group-item list-group-item-action bg-light"
          >
            Rooms
          </Link>
          <Link
            to="/friends"
            className="list-group-item list-group-item-action bg-light"
          >
            Friends
          </Link>
          <Link
            to="/settings"
            className="list-group-item list-group-item-action bg-light"
          >
            Settings
          </Link>
          <a
            href="#"
            onClick={logout}
            className="list-group-item list-group-item-action bg-light"
          >
            Log out
          </a>
        </div>
      </div>

      {!isConnecting && (
        <div id="page-content-wrapper">
          <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <button className="btn " id="menu-toggle" onClick={toggleSideBar}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>

          <div className="container-fluid">
            <Route path="/rooms" component={ChatroomPage}></Route>
            <Route path="/friends" component={FriendPage}></Route>
            <Route
              path="/chat/:id"
              render={(props) => <ChatPage {...props} socket={socket} />}
            ></Route>
          </div>
        </div>
      )}
    </div>
  );
}

export default withRouter(DashboardPage);
