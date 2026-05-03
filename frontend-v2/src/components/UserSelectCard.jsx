import './card.css'
export default function UserSelectCard({
  name,
  email,
  onSelect
}) {
  return (
    <div className="card">
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