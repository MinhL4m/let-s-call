import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ChatroomPage } from "./pages/ChatroomPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginPage} exact />
        <Route path="/register" component={RegisterPage} exact />
        <Route path="/dashboard" component={DashboardPage} exact />
        <Route path="/chatroom" component={ChatroomPage} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
