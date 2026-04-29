function ProgressBar({ percent }) {
  return (
    <div className="bar">
      <div
        className="fill"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;