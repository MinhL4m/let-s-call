import { Redirect, Route } from "react-router-dom";
import { useUserValue } from "../../context/user-provider";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useUserValue();

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
