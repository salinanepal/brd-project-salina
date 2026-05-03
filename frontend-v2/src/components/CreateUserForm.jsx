import { useState } from "react";

export default function CreateUserForm({ onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      await onCreate({ name, email });

      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Create User</h3>

      <input
        className="form-input"
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="form-input"
        type="text"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}

      <button className="form-btn" type="submit">
        Create User
      </button>
    </form>
  );
}