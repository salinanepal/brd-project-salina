import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import GoalSelectCard from "../components/GoalSelectCard";
import CreateGoalForm from "../components/CreateGoalForm";
import "./GoalsPage.css";
import { getGoals, createGoal } from "../api/api";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("selectedUser"));

  // AUTH GUARD
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    async function fetchGoals() {
      const data = await getGoals();
      setGoals(data);
    }

    fetchGoals();
  }, []);

  const handleCreateGoal = async (goal) => {
    setError("");

    try {
      await createGoal(goal);

      async function fetchGoals() {
        const data = await getGoals();
        setGoals(data);
      }

      fetchGoals();

      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectGoal = (goal) => {
    setSelectedGoalId(goal.id); // UI selection
    navigate(`/goals/${goal.id}`);
  };
  return (
    <div className="goals-page">
      <TopBar />
      <h1>Welcome, {user?.name}</h1>

      <h2>Choose a goal to contribute to</h2>
      <div></div>
      <div className="card-container">
        {/* GOAL LIST */}
        <div>
          {goals.map((goal) => {
            const completed = goal.total_raised >= goal.target_amount;

            return (
              <GoalSelectCard
                key={goal.id}
                title={goal.title}
                targetAmount={goal.target_amount}
                raisedAmount={goal.total_raised}
                completed={completed}
                selected={selectedGoalId === goal.id}
                onSelect={() => handleSelectGoal(goal)}
              />
            );
          })}
        </div>
      </div>

      {/* NOT IN LIST BUTTON */}
      <p style={{ marginTop: "20px", color: "#6b7280" }}>Not in the list?</p>
      <div>
        <button className="form-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create New Goal"}
        </button>
      </div>

      {/* ERROR MESSAGE (duplicate goal etc.) */}
      {error && <p className="form-error">{error}</p>}

      {/* CREATE GOAL FORM */}
      {showForm && <CreateGoalForm onCreate={handleCreateGoal} />}
    </div>
  );
}
