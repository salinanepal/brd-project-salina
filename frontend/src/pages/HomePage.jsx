import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../api/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

  const { selectUser } = useUser();
  const navigate = useNavigate();

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // CREATE USER
  const handleCreate = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;

    const res = await createUser({ name, email });

    setMsg(res.message);
    e.target.reset();
    loadUsers();

    setTimeout(() => setMsg(""), 3000);
  };

  // SELECT USER
  const handleSelect = (user) => {
    selectUser(user);
    navigate("/goals");
  };

  // DELETE USER (NEW)
  const handleDelete = async (id) => {
    await deleteUser(id);
    setMsg("User deleted");
    loadUsers();

    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="container">
      <h1>Select User</h1>

      {msg && <p className="success">{msg}</p>}

      {/* CREATE USER */}
      <form className="card" onSubmit={handleCreate}>
        <h3>Create User</h3>

        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />

        <button type="submit">Create</button>
      </form>

      {/* USERS LIST */}
      <div className="grid">
        {users.map((u) => (
          <div className="card" key={u.id}>
            <h3>{u.name}</h3>
            <p>{u.email}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleSelect(u)}>
                Select
              </button>

              <button
                onClick={() => handleDelete(u.id)}
                style={{ background: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}