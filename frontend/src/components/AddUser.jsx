import { useState } from "react";
import { createUser } from "../api/api";

export default function AddUser() {
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;

    const res = await createUser({ name, email });

    setMsg(res.message);
    e.target.reset();

    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add User</h2>

      {msg && <p className="success">{msg}</p>}

      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />

      <button>Add</button>
    </form>
  );
}