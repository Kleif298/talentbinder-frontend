import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleAuthResponse, getUserData } from "~/utils/auth";
import MessageBanner from "~/components/MessageBanner/MessageBanner";
import type { Message } from "~/components/MessageBanner/MessageBanner";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);

  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.statusText);
      }

      const data = await res.json();
      if (data.success) {
        handleAuthResponse(data);
        // Debug-Information
        console.log("Login erfolgreich, User-Daten:", getUserData());
        navigate("/events", { replace: true });
      } else {
        setMessage({ type: "error", text: "Login fehlgeschlagen: " + data.message, duration: 0 });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Login fehlgeschlagen: " + err.message, duration: 0 });
    }
  };

  return (
    <div className="login-container">
      <div className="login-message">
        {message && <MessageBanner message={message} onClose={() => setMessage(null)} />}
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <div className="register-link-container">
          <span>Don't have an account? </span>
          <Link to="/register" className="register-link">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
