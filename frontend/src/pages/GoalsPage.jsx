import { useEffect, useState } from "react";
import { getGoals, createGoal, deleteGoal } from "../api/api";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Toast from "../components/Toast";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [toast, setToast] = useState(null);

  const { user } = useUser();

  const load = async () => {
    setGoals(await getGoals());
  };

  useEffect(() => {
    load();
  }, []);

  const addGoal = async (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const target_amount = e.target.target.value;

    const res = await createGoal({ title, target_amount });

    setToast(res.title + " created");
    e.target.reset();
    load();

    setTimeout(() => setToast(null), 3000);
  };

  const remove = async (id) => {
    await deleteGoal(id);
    setToast("Goal deleted");
    load();
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="container">
      <Toast message={toast} />

      <h1>Welcome {user?.name}</h1>

      <form className="card" onSubmit={addGoal}>
        <input name="title" placeholder="Goal title" />
        <input name="target" type="number" placeholder="Target amount" />
        <button>Create Goal</button>
      </form>

      <div className="grid">
        {goals.map((g) => (
          <div className="card" key={g.id}>
            <h3>{g.title}</h3>
            <p>{g.target_amount}</p>

            <Link to={`/goals/${g.id}`}>Open</Link>

            <button onClick={() => remove(g.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}