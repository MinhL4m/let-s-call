import { BrowserRouter, Switch } from "react-router-dom";
import { PrivateRoute } from "./components/common/PrivateRoute";
import { PublicRoute } from "./components/common/PublicRoute";
import { UserProvider } from "./context/user-provider";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequestResetPassword } from "./pages/RequestResetPasswordPage";
import ResetPassword from "./pages/ResetPasswordPage";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={LoginPage} exact />
          <PublicRoute path="/register" component={RegisterPage} exact />
          <PublicRoute
            path="/requestPasswordReset"
            component={RequestResetPassword}
            exact
          />
          <PublicRoute path="/passwordReset" component={ResetPassword} exact />
          <PrivateRoute path="/" component={DashboardPage} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
