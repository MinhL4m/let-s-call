import "../styles/dashboardPage.css";
import { useUserValue } from "../context/user-provider";
import { Link, Route } from "react-router-dom";
import { ChatroomPage } from "./ChatroomPage";
import { FriendPage } from "./FriendPage";

export function DashboardPage({ socket }) {
  const { user } = useUserValue();

  const toggleSideBar = () => {
    const wrapper = document.querySelector("#wrapper");
    wrapper.classList.contains("toggled")
      ? wrapper.classList.remove("toggled")
      : wrapper.classList.add("toggled");
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
            onClick={(e) => {
              e.preventDefault();
              return false;
            }}
            className="list-group-item list-group-item-action bg-light"
          >
            Log out
          </a>
        </div>
      </div>

      <div id="page-content-wrapper">
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <button className="btn " id="menu-toggle" onClick={toggleSideBar}>
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

        <div className="container-fluid">
          <Route path="/rooms" component={ChatroomPage}></Route>
          <Route path="/friends" component={FriendPage}></Route>
        </div>
      </div>
    </div>
  );
}
