import "./Leaderboard.css";

const MedalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const RANK_STYLES = [
  { bg: "#fffbeb", border: "#fde68a", badge: "#d97706", label: "1st" },
  { bg: "#f8f8f8", border: "#e2e2e2", badge: "#6b7280", label: "2nd" },
  { bg: "#fff8f2", border: "#fed7aa", badge: "#c2410c", label: "3rd" },
];

export default function Leaderboard({ contributors }) {
  if (!contributors?.length) return null;

  return (
    <div className="lb-card">
      <div className="lb-card__head">
        <span className="lb-card__title">Leaderboard</span>
        <div className="lb-card__icon">
          <MedalIcon />
        </div>
      </div>

      <div className="lb-list">
        {contributors.map((c, i) => {
          const style = RANK_STYLES[i] || {
            bg: "#fafaf8",
            border: "#e8e6e0",
            badge: "#aaa89f",
            label: `${i + 1}th`,
          };
          return (
            <div
              key={c.id}
              className="lb-item"
              style={{ background: style.bg, borderColor: style.border }}
            >
              <div
                className="lb-item__rank"
                style={{
                  color: style.badge,
                  borderColor: style.badge + "40",
                  background: style.badge + "15",
                }}
              >
                {style.label}
              </div>
              <div
                className="lb-item__avatar"
                style={{
                  background:
                    i === 0
                      ? "#d97706"
                      : i === 1
                        ? "#6b7280"
                        : i === 2
                          ? "#c2410c"
                          : "#639922",
                }}
              >
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="lb-item__info">
                <span className="lb-item__name">{c.name}</span>
                <span className="lb-item__meta">
                  {c.num_contributions} contribution
                  {c.num_contributions !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="lb-item__amount">
                Rs {c.total_contributed.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
