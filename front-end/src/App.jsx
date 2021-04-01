import { useState, useEffect } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "./components/common/PrivateRoute";
import { PublicRoute } from "./components/common/PublicRoute";
import { UserProvider } from "./context/user-provider";
import { DashboardPage } from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);

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
        setTimeout(setupSocket, 30000);
        console.log("cannot connect socket");
      });

      newSocket.on("connect", () => {
        console.log("sucess connect socket");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <Switch>
          <PublicRoute
            path="/login"
            component={LoginPage}
            setupSocket={setupSocket}
            exact
          />
          <PublicRoute path="/register" component={RegisterPage} exact />
          <PrivateRoute path="/" component={DashboardPage} socket={socket} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
