import { createRef, useState } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useUserValue } from "../context/user-provider";
import axios from "axios";

function LoginPage() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const history = useHistory();
  const { setUser } = useUserValue();

  const [error, setError] = useState("");

  async function login() {
    window.event.preventDefault();
    setError("");
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });

      localStorage.setItem("CC_Token", res.data.token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${res.data.token}`;
      setUser(res.data.user);
      history.replace("/rooms");
    } catch (e) {
      if (e.response) {
        setError(e.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  }

  return (
    <div
      className="login d-flex align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="container">
        <div
          id="login-row"
          className="row justify-content-center align-items-center"
        >
          <div id="login-column" className="col-md-6">
            <div id="login-box" className="col-md-12">
              <form id="login-form" className="form" onSubmit={login}>
                <h3 className="text-center ">Login</h3>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <br />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    ref={emailRef}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <br />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    ref={passwordRef}
                  />
                </div>
                <small id="passwordHelp" className="text-danger">
                  {error}
                </small>

                <div className="row justify-content-between align-items-baseline">
                  <div className="col-sm-12 col-md-8 mb-3">
                    <Link to="/register">Register</Link>
                    <span>&nbsp;or&nbsp;</span>
                    <Link to="/requestPasswordReset">Forgot password?</Link>
                  </div>

                  <div className="form-group col-sm-12 col-md-4">
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-md btn-outline-dark"
                      value="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(LoginPage);
