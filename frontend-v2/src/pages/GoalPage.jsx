import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGoalSummary, createContribution } from "../api/api";
import TopBar from "../components/TopBar";
import "./GoalPage.css";
import GoalStatsBar from "../components/GoalStatsBar";
import ActivityFeed from "../components/ActivityFeed";
import Leaderboard from "../components/Leaderboard";
import ContributorList from "../components/ContributorList";

//DONUT CHART
function DonutChart({ raised, target }) {
  const percent = Math.min((raised / target) * 100, 100);
  const radius = 72;
  const stroke = 14;
  const normalised = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const filled = (percent / 100) * circumference;
  const remaining = target - raised;

  return (
    <div className="donut-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* track */}
        {percent < 100 && (
          <circle
            cx="80"
            cy="80"
            r={normalised}
            fill="none"
            stroke="#eeede8"
            strokeWidth={stroke}
          />
        )}
        {/* fill */}
        <circle
          cx="80"
          cy="80"
          r={normalised}
          fill="none"
          stroke="url(#donutGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={
            percent >= 100 ? `${circumference} 0` : `${filled} ${circumference}`
          }
          strokeDashoffset={circumference / 4}
          style={{
            transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#97c459" />
            <stop offset="100%" stopColor="#3b6d11" />
          </linearGradient>
        </defs>
        {/* center text */}
        <text
          x="80"
          y="72"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="#2c2c2a"
        >
          {percent.toFixed(0)}%
        </text>
        <text x="80" y="92" textAnchor="middle" fontSize="10" fill="#888780">
          FUNDED
        </text>
      </svg>
      <div className="donut-legend">
        <div className="donut-legend__item">
          <span className="donut-legend__dot donut-legend__dot--raised" />
          <span>
            Raised <strong>Rs {raised.toLocaleString()}</strong>
          </span>
        </div>
        <div className="donut-legend__item">
          <span className="donut-legend__dot donut-legend__dot--remaining" />
          <span>
            Remaining <strong>Rs {remaining.toLocaleString()}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

//MAIN PAGE
export default function GoalPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [contributing, setContributing] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("selectedUser") || "null");

  // AUTH GUARD
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    getGoalSummary(goalId)
      .then(setGoal)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user, goalId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;
  if (loading)
    return (
      <div className="goal-page">
        <TopBar backTo="/goals" backLabel="Goals" />
        <div className="goal-loading">Loading goal...</div>
      </div>
    );
  if (!goal)
    return (
      <div className="goal-page">
        <TopBar backTo="/goals" backLabel="Goals" />
        <p>Goal not found.</p>
      </div>
    );

  const remaining = goal.target_amount - goal.total_raised;
  const completed = goal.status === "completed";
  const isOverdue =
    goal.target_date && !completed && new Date(goal.target_date) < new Date();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const handleContribute = async (e) => {
    e.preventDefault();
    setError("");

    const contribution = Number(amount);
    if (!contribution || contribution <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (contribution > remaining) {
      setError(`Max contribution is Rs ${remaining}.`);
      return;
    }

    setContributing(true);
    try {
      await createContribution({
        user_id: user.id,
        goal_id: Number(goalId),
        amount: contribution,
      });
      const updated = await getGoalSummary(goalId);
      setGoal(updated);
      setAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setContributing(false);
    }
  };

  return (
    <div className="goal-page">
      <TopBar backTo="/goals" backLabel="Goals" />

      {/* HERO BANNER */}
      <div
        className={`goal-hero ${isOverdue ? "goal-hero--overdue" : ""} ${completed ? "goal-hero--completed" : ""}`}
      >
        <div className="goal-hero__info">
          <div className="goal-hero__title">{goal.title}</div>
          <div className="goal-hero__meta">
            {goal.created_by_name && (
              <span>👤 Created by {goal.created_by_name}</span>
            )}
            {goal.target_date && (
              <span className={isOverdue ? "overdue-text" : ""}>
                📅 {isOverdue ? "Overdue · " : "Due "}
                {formatDate(goal.target_date)}
              </span>
            )}
          </div>
          {completed && (
            <div className="goal-hero__completed-badge"> Goal Completed!</div>
          )}
          {isOverdue && (
            <div className="goal-hero__overdue-badge">⚠ Past target date</div>
          )}
        </div>

        <GoalStatsBar goal={goal} />
      </div>

      {/* MAIN GRID */}
      <div className="goal-grid">
        {/* LEFT COLUMN */}
        <div className="goal-col">
          {/* DONUT CHART */}
          <div className="goal-card">
            <div className="goal-card__head">
              <h2>Funding Progress</h2>
            </div>
            <DonutChart
              raised={goal.total_raised}
              target={goal.target_amount}
            />
          </div>

          {/* CONTRIBUTE FORM */}
          {!completed && (
            <div className="goal-card goal-card--contribute">
              <div className="goal-card__head">
                <h2>Make a Contribution</h2>
                <span className="goal-card__sub">
                  Rs {remaining.toLocaleString()} left
                </span>
              </div>
              <form onSubmit={handleContribute} className="contrib-form">
                <div className="contrib-input-wrap">
                  <span className="contrib-input-prefix">Rs</span>
                  <input
                    type="number"
                    className="contrib-input"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button
                  className="form-btn"
                  type="submit"
                  disabled={contributing}
                >
                  {contributing ? "Processing..." : "Contribute"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="goal-col">
          <div className="goal-insights-grid">
            <Leaderboard contributors={goal.contributors} />
            <ContributorList
              contributors={goal.contributors}
              total={goal.total_raised}
            />
          </div>

          <ActivityFeed contributions={goal.recent_contributions} />
        </div>
      </div>
    </div>
  );
}
