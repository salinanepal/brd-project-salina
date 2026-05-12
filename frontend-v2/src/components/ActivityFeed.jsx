import "./ActivityFeed.css";

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
  </svg>
);

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityFeed({ contributions }) {
  if (!contributions?.length) return null;

  return (
    <div className="feed-card">
      <div className="feed-card__head">
        <div className="feed-card__title-wrap">
          <span className="feed-card__title">Recent Activity</span>
          <span className="feed-live-dot" />
        </div>
        <div className="feed-card__icon"><ClockIcon /></div>
      </div>

      <div className="feed-list">
        {contributions.map((c, i) => (
          <div key={c.id} className="feed-item">
            <div className="feed-item__left">
              <div className="feed-item__avatar">
                {c.name.charAt(0).toUpperCase()}
              </div>
              {i < contributions.length - 1 && <div className="feed-item__line" />}
            </div>
            <div className="feed-item__body">
              <div className="feed-item__top">
                <span className="feed-item__name">{c.name}</span>
                <span className="feed-item__time">{timeAgo(c.created_at)}</span>
              </div>
              <div className="feed-item__bottom">
                <div className="feed-item__action">
                  <div className="feed-item__action-icon"><ArrowIcon /></div>
                  contributed to goal
                </div>
                <div className="feed-item__amount">+Rs {c.amount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}