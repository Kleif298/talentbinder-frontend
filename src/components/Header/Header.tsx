import { useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";
import { getAccountEmail, getAdminStatus } from "~/utils/auth.ts";
import { MdHistory } from "react-icons/md";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const isAdmin = getAdminStatus();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header>
      <div className="header-line"></div>
      <div className="header-main">
        <h1 className="header-title">TalentBinder</h1>
        <div className="user-data">
          {isAdmin ? <p className="admin-state">Admin</p> : null}
          <div className="email-holder">{getAccountEmail()}</div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          {isAdmin && (
            <div onClick={() => {navigate("/logging");}} className="history-icon">
              <MdHistory />
            </div>
          )}
        </div>
      </div>
      <nav>
        <a href="/events" className={isActive("/events") ? "active" : ""}>
          Events
        </a>
        {isAdmin && (
          <>
            <a href="/candidates" className={isActive("/candidates") ? "active" : ""}>
              Candidates
            </a>
            <a href="/users" className={isActive("/users") ? "active" : ""}>
              Users
            </a>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
