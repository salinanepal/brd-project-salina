import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/api";
import "./LoginPage.css";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSwitch = (newMode) => {
    setMode(newMode);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError(mode === "login" ? "Incorrect password" : "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = mode === "login"
        ? await loginUser({ email: email.trim(), password })
        : await registerUser({ name: name.trim(), email: email.trim(), password });

      sessionStorage.setItem("selectedUser", JSON.stringify(result.user));
      navigate("/goals");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Team Lunch Milestone</h1>
        <div className="mode-toggle">
          <button className={`toggle-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => handleSwitch("login")} type="button">Sign in</button>
          <button className={`toggle-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => handleSwitch("register")} type="button">Register</button>
        </div>

        <p className="login-sub">
          {mode === "login"
            ? "Welcome back! Sign in to continue."
            : "Create your account to join the team."}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "register" && (
            <div className="field-group">
              <label htmlFor="name">Full name</label>
              <input id="name" className="form-input" type="text"
                placeholder="Enter full name" value={name}
                onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
          )}

          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <input id="email" className="form-input" type="email"
              placeholder="Enter email" value={email}
              onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" className="form-input" type="password"
              placeholder={mode === "login" ? "Enter password" : "Minimum 8 characters"}value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="login-hint">
          {mode === "login" ? (
            <>New here?{" "}
              <span className="login-switch" onClick={() => handleSwitch("register")}>
                Create an account
              </span></>
          ) : (
            <>Already have an account?{" "}
              <span className="login-switch" onClick={() => handleSwitch("login")}>
                Sign in
              </span></>
          )}
        </p>
      </div>
    </div>
  );
}