import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGoalSummary, addContribution } from "../api/api";
import { useUser } from "../context/UserContext";
import Toast from "../components/Toast";

export default function GoalDetailsPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [summary, setSummary] = useState(null);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setSummary(await getGoalSummary(id));
  };

  useEffect(() => {
    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const amount = e.target.amount.value;

    const res = await addContribution({
      user_id: user.id,
      goal_id: id,
      amount,
    });

    setToast(res.message);
    e.target.reset();
    load();

    setTimeout(() => setToast(null), 3000);
  };

  if (!summary) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <Toast message={toast} />

      <h1>{summary.title}</h1>
      <p>Logged in as {user?.name}</p>

      <div className="card">
        <p>Raised: {summary.total_raised}</p>
        <p>Target: {summary.target_amount}</p>
        <p>{summary.percent_complete}%</p>
      </div>

      <form className="card" onSubmit={submit}>
        <input name="amount" type="number" placeholder="Amount" />
        <button>Contribute</button>
      </form>
    </div>
  );
}