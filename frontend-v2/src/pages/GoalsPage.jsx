import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import CreateGoalForm from "../components/CreateGoalForm";
import "./GoalsPage.css";
import { getGoals, createGoal } from "../api/api";

function GoalCard({ goal, selected, onSelect }) {
  const completed = goal.status === "completed";
  const percent = Math.min((goal.total_raised / goal.target_amount) * 100, 100);
  const remaining = goal.target_amount - goal.total_raised;

  const isOverdue =
    goal.target_date && !completed && new Date(goal.target_date) < new Date();

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div
      className={`gcard ${selected ? "gcard--selected" : ""} ${completed ? "gcard--completed" : ""} ${isOverdue ? "gcard--overdue" : ""}`}
      onClick={onSelect}
    >
      {/* TOP ROW */}
      <div className="gcard__top">
        <div className="gcard__left">
          <div className="gcard__title">{goal.title}</div>
          <div className="gcard__meta">
            {goal.created_by_name && (
              <span className="gcard__creator">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="8" cy="5" r="3" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                </svg>
                {goal.created_by_name}
              </span>
            )}
            {goal.target_date && (
              <span
                className={`gcard__date ${isOverdue ? "gcard__date--overdue" : ""}`}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="3" width="12" height="11" rx="2" />
                  <path d="M5 1v3M11 1v3M2 7h12" />
                </svg>
                {isOverdue ? "Overdue · " : "Due "}
                {formatDate(goal.target_date)}
              </span>
            )}
          </div>
        </div>

        <div className="gcard__right">
          {completed ? (
            <span className="gcard__badge gcard__badge--done">✓ Completed</span>
          ) : isOverdue ? (
            <span className="gcard__badge gcard__badge--overdue">
              ⚠ Overdue
            </span>
          ) : (
            <span className="gcard__badge gcard__badge--active">Active</span>
          )}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="gcard__bar-wrap">
        <div className="gcard__bar-track">
          <div className="gcard__bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="gcard__bar-labels">
          <span className="gcard__pct">{percent.toFixed(1)}%</span>
          <span className="gcard__rem">
            {completed
              ? "Goal reached!"
              : `Rs ${remaining.toLocaleString()} left`}
          </span>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="gcard__stats">
        <div className="gcard__stat">
          <div className="gcard__stat-label">Target</div>
          <div className="gcard__stat-value">
            Rs {goal.target_amount.toLocaleString()}
          </div>
        </div>
        <div className="gcard__stat-divider" />
        <div className="gcard__stat">
          <div className="gcard__stat-label">Raised</div>
          <div className="gcard__stat-value gcard__stat-value--green">
            Rs {goal.total_raised.toLocaleString()}
          </div>
        </div>
        <div className="gcard__stat-divider" />
        <div className="gcard__stat">
          <div className="gcard__stat-label">Remaining</div>
          <div className="gcard__stat-value gcard__stat-value--muted">
            Rs {remaining.toLocaleString()}
          </div>
        </div>
      </div>

      {!completed && <div className="gcard__cta">Contribute →</div>}
    </div>
  );
}

export default function GoalsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("selectedUser") || "null");

  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  useEffect(() => {
    if (!user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    getGoals().then(setGoals);
  }, []);

  if (!user) return null;
  const activeGoals = goals.filter((g) => g.status !== "completed");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const handleCreateGoal = async (goal) => {
    setError("");
    try {
      await createGoal({ ...goal, created_by: user.id });
      const data = await getGoals();
      setGoals(data);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectGoal = (goal) => {
    setSelectedGoalId(goal.id);
    navigate(`/goals/${goal.id}`);
  };

  return (
    <div className="goals-page">
      <TopBar />

      <div className="goals-page__hero">
        <div>
          <h1>Hello, {user.name}</h1>
          <p>Pick a goal and make your contribution count.</p>
        </div>
        <button
          className="goals-page__new-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Cancel" : "+ New Goal"}
        </button>
      </div>

      {showForm && (
        <CreateGoalForm
          onCreate={handleCreateGoal}
          error={error}
          onClearError={() => setError("")}
        />
      )}
      {error && !showForm && (
        <p className="form-error" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}

      {activeGoals.length > 0 && (
        <>
          <div className="goals-section-label">Active goals</div>
          <div className="goals-list">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                selected={selectedGoalId === goal.id}
                onSelect={() => handleSelectGoal(goal)}
              />
            ))}
          </div>
        </>
      )}

      {completedGoals.length > 0 && (
        <>
          <div className="goals-section-label" style={{ marginTop: 32 }}>
            Completed goals
          </div>
          <div className="goals-list">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                selected={selectedGoalId === goal.id}
                onSelect={() => handleSelectGoal(goal)}
              />
            ))}
          </div>
        </>
      )}

      {goals.length === 0 && (
        <div className="goals-empty">
          <div className="goals-empty__icon">🎯</div>
          <p>No goals yet. Create the first one!</p>
        </div>
      )}
    </div>
  );
}
