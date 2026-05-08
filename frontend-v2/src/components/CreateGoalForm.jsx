import { useState } from "react";
import "./form.css";

export default function CreateGoalForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
  e.preventDefault();
  setError("");

  if (!title.trim()) {
    setError("Please enter a goal title.");
    return;
  }
  if (!amount || Number(amount) <= 0) {
    setError("Please enter a valid target amount.");
    return;
  }

  onCreate({ title: title.trim(), target_amount: Number(amount) });
  setTitle("");
  setAmount("");
};

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3 className="form-title">Create Goal</h3>

      <div className="form-fields">
        <input
          className="form-input"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="form-input"
          type="number"
          placeholder="Target Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}
<div>
      <button className="form-btn" type="submit">
        Create Goal
      </button>
      </div>
    </form>
  );
}