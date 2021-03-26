import { createRef } from "react";
import axios from "axios";

export function LoginPage() {
  const emailRef = createRef();
  const passwordRef = createRef();

  async function login() {
    window.event.preventDefault();
    // TODO: reset error
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      // localStorage is better then cookie: https://www.reddit.com/r/Frontend/comments/cubcpj/local_storage_vs_cookies_for_auth_tokens/
      localStorage.setItem("CC_Token", res.data.token);
      // Push to Home or DashBoard
    } catch (e) {
      console.log(e);
      //TODO Push Notification
    }
  }

  return (
    <div className="card">
      <div className="card--header">Login</div>
      <div className="card--body">
        <form className="card--form">
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
              ref={passwordRef}
            />
          </div>
          <button onClick={login}>Login</button>
        </form>
      </div>
    </div>
  );
}
