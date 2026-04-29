import ProgressBar from "./ProgressBar";

function GoalSummary({ summary }) {
  return (
    <div className="card">
      <h2>Goal Summary</h2>

      <p>Raised: ${summary.total_raised}</p>
      <p>Target: ${summary.target_amount}</p>

      <ProgressBar percent={summary.percent_complete} />

      <p>{summary.percent_complete}% Complete</p>

      <h3>Top Contributors</h3>

      {summary.contributors.map((user) => (
        <p key={user.id}>
          {user.name} - ${user.total_contributed}
        </p>
      ))}
    </div>
  );
}

export default GoalSummary;