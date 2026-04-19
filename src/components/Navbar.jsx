import { Link, useNavigate, useLocation } from "react-router-dom";
import { logOut } from "../firebase/auth";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/swipe" className="nav-logo">
        <span className="logo-icon">⚡</span> HackMate
      </Link>
      <div className="nav-links">
        <Link
          to="/swipe"
          className={`nav-link ${location.pathname === "/swipe" ? "active" : ""}`}
        >
          Discover
        </Link>
        <Link
          to="/matches"
          className={`nav-link ${location.pathname === "/matches" ? "active" : ""}`}
        >
          Matches
        </Link>
        <Link
          to="/profile"
          className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
        >
          Profile
        </Link>
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;