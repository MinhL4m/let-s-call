import { Route, Redirect } from "react-router-dom";
import { useUserValue } from "../../context/user-provider";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const { user } = useUserValue();

  return (
    <Route
      {...rest}
      render={(props) =>
        !user ? <Component {...props} /> : <Redirect to="/dashboard" />
      }
    />
  );
};
