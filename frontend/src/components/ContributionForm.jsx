import { useState } from "react";

const API = "http://localhost:8000";

function ContributionForm({ users, goalId, refresh }) {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/contributions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: Number(userId),
        goal_id: Number(goalId),
        amount: Number(amount),
      }),
    });

    setAmount("");
    refresh();
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add Contribution</h2>

      <select onChange={(e) => setUserId(e.target.value)}>
        <option>Select User</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button>Add Contribution</button>
    </form>
  );
}

export default ContributionForm;