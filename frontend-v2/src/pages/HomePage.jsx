import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSelectCard from "../components/UserSelectCard";
import CreateUserForm from "../components/CreateUserForm";

import { getUsers, createUser } from "../api/api";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  const handleCreateUser = async (user) => {
    await createUser(user);

    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }

    fetchUsers();
  };

  const handleUserSelect = (user) => {
  sessionStorage.setItem("selectedUser", JSON.stringify(user));
  navigate("/goals");
};

  return (
    <div className="container">

      <h1>Team Lunch Milestone</h1>

      <h2>Pick your profile to start contributing</h2>
      <div className="card-container">

      {users.map((user) => (
        <UserSelectCard
          key={user.id}
          name={user.name}
          email={user.email}
          onSelect={() => handleUserSelect(user)}
        />
      ))}
      </div>

      {/* TOGGLE BUTTON */}
      <p style={{ marginTop: "20px", color: "#6b7280" }}>
        Not in the list?
      </p>

      <button
        className="form-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Create New User"}
      </button>

      {/* CONDITIONAL FORM */}
      {showForm && (
        <CreateUserForm onCreate={handleCreateUser} />
      )}

    </div>
  );
}