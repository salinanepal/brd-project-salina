import "./goalProgressBar.css";

export default function GoalProgressBar({
  raised,
  target,
}) {
  const percent = Math.min((raised / target) * 100, 100);

  return (
    <div className="goal-progress-card">
      <div className="goal-progress-top">
        <span className="goal-progress-percent">
          {percent.toFixed(2)}%
        </span>
      </div>

      <div className="goal-progress-track">
        <div
          className="goal-progress-fill"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}