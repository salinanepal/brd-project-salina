import { useNavigate } from "react-router-dom";
import "./TopBar.css";

export default function TopBar({ backTo, backLabel }) {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("selectedUser") || "null");

  const handleLogout = () => {
    sessionStorage.removeItem("selectedUser");
    navigate("/");
  };

  // Get initials from name
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="topbar">
      {backTo ? (
        <button className="back-btn" onClick={() => navigate(backTo)}>
         Back to {backLabel || "Back"}
        </button>
      ) : (
        <div /> 
      )}

      {user && (
        <div className="topbar-right">
          <div className="user-pill">
            <div className="user-pill__avatar">{initials}</div>
            <span className="user-pill__name">{user.name}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}