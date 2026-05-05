import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/api";
import "./LoginPage.css";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSwitch = (newMode) => {
    setMode(newMode);
    setError("");
    setName("");
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const result = mode === "login"
        ? await loginUser({ name: name.trim(), email: email.trim() })
        : await registerUser({ name: name.trim(), email: email.trim() });

      sessionStorage.setItem("selectedUser", JSON.stringify(result.user));
      navigate("/goals");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Team Lunch Milestone</h1>

        {/* TOGGLE */}
        <div className="mode-toggle">
          <button
            className={`toggle-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => handleSwitch("login")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`toggle-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => handleSwitch("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <p className="login-sub">
          {mode === "login"
            ? "Enter your name and email to sign in."
            : "Create a new account to join the team."}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              className="form-input"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="form-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <p className="login-hint">
          {mode === "login" ? (
            <>New here?{" "}
              <span className="login-switch" onClick={() => handleSwitch("register")}>
                Create an account
              </span>
            </>
          ) : (
            <>Already have an account?{" "}
              <span className="login-switch" onClick={() => handleSwitch("login")}>
                Sign in
              </span>
            </>
          )}
        </p>

      </div>
    </div>
  );
}