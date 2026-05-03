import "./card.css";

export default function GoalSelectCard({
  title,
  targetAmount,
  raisedAmount,
  completed,
  selected,
  onSelect,
}) {
  return (
    <div className={`card ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>

        <p className="card-subtitle">
          Raised: Rs {raisedAmount} / Rs {targetAmount}
        </p>
      </div>

      {completed ? (
        <span className="completed-badge">Completed</span>
      ) : (
        <button className="card-btn">Select</button>
      )}
    </div>
  );
}
