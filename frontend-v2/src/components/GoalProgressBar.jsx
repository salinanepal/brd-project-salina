import "./goalProgressBar.css";

export default function GoalProgressBar({
  title,
  raised,
  target,
}) {
  const percent = Math.min((raised / target) * 100, 100);

  return (
    <div className="goal-progress-card">
      <div className="goal-progress-top">
        <h2 className="goal-progress-title">{title}</h2>
        <span className="goal-progress-percent">
          {percent.toFixed(0)}%
        </span>
      </div>

      <div className="goal-progress-track">
        <div
          className="goal-progress-fill"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <div className="goal-progress-stats">
        <span>Raised: Rs {raised}</span>
        <span>Target: Rs {target}</span>
      </div>
    </div>
  );
}