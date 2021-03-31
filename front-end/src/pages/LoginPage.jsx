import { createRef, useState } from "react";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useUserValue } from "../context/user-provider";
import axios from "axios";

function LoginPage({ setupSocket }) {
  const emailRef = createRef();
  const passwordRef = createRef();
  const history = useHistory();
  const { setUser } = useUserValue();

  const [error, setError] = useState("");

  async function login() {
    window.event.preventDefault();
    console.log(history);
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
      setupSocket();
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
                <div className="d-flex justify-content-between d-flex align-items-baseline">
                  <div className="form-group">
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-md btn-outline-dark"
                      value="submit"
                    />
                  </div>
                  <Link to="/register">Register</Link>
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
