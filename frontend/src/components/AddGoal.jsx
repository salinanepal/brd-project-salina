import { useState } from "react";
import { createGoal } from "../api/api";

export default function AddGoal() {
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const target = e.target.target.value;

    const res = await createGoal({
      title,
      target_amount: Number(target),
    });

    setMsg("Goal created!");
    e.target.reset();

    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add Goal</h2>

      {msg && <p className="success">{msg}</p>}

      <input name="title" placeholder="Goal title" />
      <input name="target" placeholder="Target amount" type="number" />

      <button>Create</button>
    </form>
  );
}