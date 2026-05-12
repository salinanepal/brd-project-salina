import { useState } from "react";
import "./form.css";

export default function CreateGoalForm({ onCreate, error }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!title.trim()) {
      setLocalError("Please enter a goal title.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setLocalError("Please enter a valid target amount.");
      return;
    }

    onCreate({
      title: title.trim(),
      target_amount: Number(amount),
      target_date: targetDate || null,
    });

    setTitle("");
    setAmount("");
    setTargetDate("");
  };

  const displayError = localError || error;

  return (
    <form className="form-card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3 className="form-title">Create New Goal</h3>

      <div className="form-fields">
        <input
          className="form-input"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-input"
          type="number"
          placeholder="Target amount (Rs)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="form-date-wrap">
          <label className="form-date-label">
            Target date <span className="form-date-optional">(optional)</span>
          </label>
          <input
            className="form-input"
            type="date"
            value={targetDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>

      {displayError && <p className="form-error">{displayError}</p>}

      <button className="form-btn" type="submit">
        Create Goal
      </button>
    </form>
  );
}