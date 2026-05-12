import "./ContributorList.css";

const BAR_COLORS = ["#3b6d11","#639922","#97c459","#c0dd97","#27500a","#4a8515"];

export default function ContributorList({ contributors}) {
  if (!contributors?.length) return null;

  return (
    <div className="contrib-card">
      <div className="contrib-card__head">
        <span className="contrib-card__title">Contributors</span>
        <span className="contrib-card__sub">{contributors.length} members</span>
      </div>

      <div className="contrib-list">
        {contributors.map((c, i) => {
        //   const pct = total > 0 ? (c.total_contributed / total) * 100 : 0;
          return (
            <div key={c.id} className="contrib-item">
              <div className="contrib-item__header">
                <div className="contrib-item__avatar"
                  style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="contrib-item__info">
                  <span className="contrib-item__name">{c.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}