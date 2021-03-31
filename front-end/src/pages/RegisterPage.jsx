import axios from "axios";
import { createRef, useState } from "react";
import { Link } from "react-router-dom";

export function RegisterPage() {
  // Uncontrolled component since don't do anything fancy
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function register() {
    setError("");
    window.event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await axios.post(
        "http://localhost:3001/auth/register",
        {
          name,
          email,
          password,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
      res.data
        ? setSuccess("Account created")
        : setError("Something went wrong");
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
      className="register d-flex align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="container">
        <div
          id="register-row"
          className="row justify-content-center align-items-center"
        >
          <div id="register-column" className="col-md-6">
            <div id="register-box" className="col-md-12">
              <form id="register-form" className="form" onSubmit={register}>
                <h3 className="text-center ">Register</h3>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <br />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                    ref={nameRef}
                  />
                </div>
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
                <small id="passwordHelp" className="text-danger ">
                  {error}
                </small>
                <small id="passwordHelp" className="text-success ">
                  {success}
                </small>
                <div className="d-flex justify-content-between d-flex align-items-baseline mt-2">
                  <div className="form-group">
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-md btn-outline-dark"
                      value="submit"
                    />
                  </div>
                  <Link to="/login">Already have account?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
