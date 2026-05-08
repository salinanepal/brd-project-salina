import './card.css'
export default function UserSelectCard({
  name,
  email,
  selected,
  onSelect
}) {
  return (
    <div className={`card ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="card-info">
        <h3 className="card-title">{name}</h3>
        <p className="card-subtitle">{email}</p>
      </div>

      <button className="card-btn" onClick={onSelect}>
        Select
      </button>
    </div>
  );
}