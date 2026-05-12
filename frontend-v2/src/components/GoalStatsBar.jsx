import "./GoalStatsBar.css";

const icons = {
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  raised: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  remaining: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  contributors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

export default function GoalStatsBar({ goal }) {
  const remaining = goal.target_amount - goal.total_raised;
  const percent = Math.min((goal.total_raised / goal.target_amount) * 100, 100);
  const completed = goal.status === "completed";

  const cards = [
    {
      key: "target",
      label: "Target Amount",
      value: `Rs ${goal.target_amount.toLocaleString()}`,
      sub: "Goal to reach",
      accent: "blue",
    },
    {
      key: "raised",
      label: "Total Raised",
      value: `Rs ${goal.total_raised.toLocaleString()}`,
      sub: `${percent.toFixed(1)}% of target`,
      accent: "green",
      highlight: true,
    },
    {
      key: "remaining",
      label: "Remaining",
      value: completed ? "Rs 0" : `Rs ${remaining.toLocaleString()}`,
      sub: completed ? "Goal achieved!" : "Still needed",
      accent: completed ? "green" : "amber",
    },
    {
      key: "contributors",
      label: "Contributors",
      value: goal.contributors?.length || 0,
      sub: `${goal.contribution_count || 0} total contributions`,
      accent: "purple",
    },
  ];

  return (
    <div className="stats-bar">
      {cards.map((card) => (
        <div key={card.key} className={`stat-card stat-card--${card.accent} ${card.highlight ? "stat-card--highlight" : ""}`}>
          <div className="stat-card__top">
            <div className={`stat-card__icon stat-card__icon--${card.accent}`}>
              {icons[card.key]}
            </div>
            <div className="stat-card__label">{card.label}</div>
          </div>
          <div className="stat-card__value">{card.value}</div>
          <div className="stat-card__sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}