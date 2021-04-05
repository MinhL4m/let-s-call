import { createRef, useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import axios from "axios";

function ResetPassword() {
  let query = useQuery();
  const history = useHistory();
  const passwordRef = createRef();

  useEffect(() => {
    console.log("token and id >>> ", query.get("token"), query.get("id"));
  }, []);

  const [error, setError] = useState("");

  async function resetPassword() {
    window.event.preventDefault();
    setError("");
    const password = passwordRef.current.value;

    try {
      const res = await axios.post(
        "http://localhost:3001/auth/reset-password",
        {
          password,
          userId: query.get("id"),
          token: query.get("token"),
        }
      );
      if (res.data) {
        history.replace("/login");
      }
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
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="col-md-12">
              <form className="form" onSubmit={resetPassword}>
                <h3 className="text-center ">Reset Password</h3>
                <div className="form-group">
                  <label htmlFor="password">New Password:</label>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ResetPassword);
