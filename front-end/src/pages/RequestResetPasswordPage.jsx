import { createRef, useState } from "react";
import axios from "axios";

export function RequestResetPassword() {
  const emailRef = createRef();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function requestReset() {
    window.event.preventDefault();
    setError("");
    setSuccess("");
    const email = emailRef.current.value;

    try {
      const res = await axios.post(
        "http://localhost:3001/auth/request-reset-password",
        {
          email,
        }
      );
      setSuccess(res.data.message);
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
              <form className="form" onSubmit={requestReset}>
                <h3 className="text-center ">Request Reset Password</h3>
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
                <small className="text-success">{success}</small>
                <small className="text-danger">{error}</small>
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
