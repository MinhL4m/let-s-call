import axios from "axios";
import { createRef } from "react";

export function RegisterPage() {
  // Uncontrolled component since don't do anything fancy
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();

  async function register() {
    window.event.preventDefault();
    //   TODO: reset error
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await axios.post(
        "http://localhost:3001/auth/register",
        {
          name,
          email,
          password,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
      //TODO: indicator
    } catch (e) {}
  }

  return (
    <div className="card">
      <div className="card--header">Register</div>
      <div className="card--body">
        <div className="card--form">
          <div className="card--input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              className="card--name"
              placeholder="John Wick"
              ref={nameRef}
            />
          </div>
          <div className="card--input">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              className="card--email"
              placeholder="abc@eaxmple.com"
              ref={emailRef}
            />
          </div>
          <div className="card--input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="card--password"
              placeholder="Password"
              ref={passwordRef}
            />
          </div>
          <button onClick={register}>Register</button>
        </div>
      </div>
    </div>
  );
}
