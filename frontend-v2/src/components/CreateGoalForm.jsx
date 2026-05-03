import { useState } from "react";
import "./form.css";

export default function CreateGoalForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onCreate({
      title,
      target_amount: Number(amount),
    });

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

      <button className="form-btn" type="submit">
        Create Goal
      </button>
    </form>
  );
}