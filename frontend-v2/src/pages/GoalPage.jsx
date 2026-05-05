import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoalSummary, createContribution } from "../api/api";
import GoalProgressBar from "../components/GoalProgressBar";
import "./GoalPage.css";
import TopBar from "../components/TopBar";

export default function GoalPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(sessionStorage.getItem("selectedUser") || "null");

  // AUTH GUARD
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    async function fetchGoal() {
      try {
        const data = await getGoalSummary(goalId);
        setGoal(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGoal();
  }, [goalId]);

  if (loading || !goal) return <p>Loading...</p>;
  const remaining = goal.target_amount - goal.total_raised;
  const completed = goal.total_raised >= goal.target_amount;

  const handleContribute = async (e) => {
    e.preventDefault();
    setError("");

    const contribution = Number(amount);

    if (!contribution || contribution <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (contribution > remaining) {
      setError("Contribution cannot exceed remaining target amount.");
      return;
    }

    await createContribution({
      user_id: user.id,
      goal_id: Number(goalId),
      amount: contribution,
    });

    const updated = await getGoalSummary(goalId);
    setGoal(updated);

    setAmount("");
  };

  return (
    <div className="goal-page">
      <TopBar backTo="/goals" backLabel="Goals" />
      {/* HEADER CARD */}
      <div className="goal-header-card">
        <h1>{goal.title}</h1>

        <p className="progress-text">{goal.percent_complete}% completed</p>

        <GoalProgressBar
          title={goal.title}
          raised={goal.total_raised}
          target={goal.target_amount}
        />

        {completed && <span className="badge-success">Goal Completed!</span>}
      </div>

      {/* STATS ROW */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Target</h3>
          <p>Rs {goal.target_amount}</p>
        </div>

        <div className="stat-card">
          <h3>Raised</h3>
          <p>Rs {goal.total_raised}</p>
        </div>

        <div className="stat-card">
          <h3>Remaining</h3>
          <p>Rs {remaining}</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="goal-main-grid">
        {/* LEFT SIDE */}
        <div className="left-column">
          {/* CONTRIBUTION FORM */}
          <div className="goal-card">
            <h2>Contribute</h2>

            <form onSubmit={handleContribute}>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {error && <p className="form-error">{error}</p>}

              <button className="form-btn" type="submit">
                Contribute
              </button>
            </form>
          </div>

          {/* LEADERBOARD */}
          {goal.contributors?.length>0 &&( 
          <div className="goal-card">
            <div className="card-header">
              <h2>Leaderboard</h2>
              <span className="subtext">
                {goal.contributors?.length || 0} contributors
              </span>
            </div>

            <div className="leaderboard">
              {goal.contributors?.map((u, index) => (
                <div key={u.id} className="leaderboard-row">
                  <div className="rank-badge">#{index + 1}</div>

                  <div className="leaderboard-info">
                    <div className="name">{u.name}</div>
                    <div className="meta">
                      {u.num_contributions} contributions
                    </div>
                  </div>

                  <div className="amount">Rs {u.total_contributed}</div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        {goal.recent_contributions?.length > 0 && (
        <div className="right-column">
          <div className="goal-card activity-card">
            <div className="card-header">
              <h2>Recent Activity</h2>
              <span className="subtext">Live feed</span>
            </div>

            <div className="activity-list">
              {goal.recent_contributions?.map((c) => (
                <div key={c.id} className="activity-item">
                  <div className="activity-dot" />

                  <div className="activity-main">
                    <div className="activity-text">
                      <strong>{c.name}</strong> contributed
                    </div>
                    <div className="activity-time">
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="activity-amount">+Rs {c.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
