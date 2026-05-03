import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoalSelectCard from "../components/GoalSelectCard";
import CreateGoalForm from "../components/CreateGoalForm";
import "./GoalsPage.css"
import { getGoals, createGoal } from "../api/api";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const user = JSON.parse(localStorage.getItem("selectedUser"));

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

  const navigate = useNavigate();

  const handleSelectGoal = (goal) => {
    setSelectedGoalId(goal.id); // UI selection
    navigate(`/goals/${goal.id}`);
  };
  return (
    <div className="goals-page">
      <h1>Welcome, {user?.name}</h1>

      <h2>Select a goal to contribute</h2>

      {/* GOAL LIST */}
      <div className="">
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

      {/* NOT IN LIST BUTTON */}
      <p style={{ marginTop: "20px", color: "#6b7280" }}>Not in the list?</p>

      <button className="form-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Create New Goal"}
      </button>

      {/* ERROR MESSAGE (duplicate goal etc.) */}
      {error && <p className="form-error">{error}</p>}

      {/* CREATE GOAL FORM */}
      {showForm && <CreateGoalForm onCreate={handleCreateGoal} />}
    </div>
  );
}
