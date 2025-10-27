import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleAuthResponse } from "~/utils/auth";
import MessageBanner from "~/components/MessageBanner/MessageBanner";
import type { Message } from "~/components/MessageBanner/MessageBanner";

import "./Register.scss";

const Register = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message | null>(null);

  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, first_name, last_name }),
      });
      if (!res.ok) {
        throw new Error("Server error: " + res.statusText);
      }

      const data = await res.json();
      if (data.success) {
        handleAuthResponse(data);
        setMessage({ type: "success", text: "Registrierung erfolgreich! Automatische Anmeldung..." });
        setTimeout(() => navigate("/events"), 1500);
      } else {
        setMessage({ type: "error", text: "Registrierung fehlgeschlagen: " + data.message, duration: 0 });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Registrierung fehlgeschlagen: " + err.message, duration: 0 });
    }
  };

  return (
    <div className="register-container">
      <MessageBanner message={message} onClose={() => setMessage(null)} />
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register</h2>

        <div className="input-group">
          <label htmlFor="username">Username *optional</label>
          <input
            type="username"
            id="first_name"
            name="first_name"
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="last_name">Last Name *optional</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>
        <button type="submit" className="register-btn">
          Register
        </button>
        <div className="register-link-container">
          <span>Already have an account?</span>
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
