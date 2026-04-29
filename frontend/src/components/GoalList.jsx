import { Link } from "react-router-dom";

function GoalList({ goals }) {
  return (
    <div className="grid">
      {goals.map((goal) => (
        <div className="card" key={goal.id}>
          <h2>{goal.title}</h2>
          <p>Target: ${goal.target_amount}</p>

          <Link to={`/goals/${goal.id}`} className="btn">
            View Goal
          </Link>
        </div>
      ))}
    </div>
  );
}

export default GoalList;