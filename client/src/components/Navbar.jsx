import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          🔍 <span>ServiceLens</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/providers" className={isActive("/providers")}>
            Compare
          </Link>
          {user && user.role === "admin" && (
            <Link to="/admin" className={isActive("/admin")}>
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span
                style={{
                  color: "var(--text-dim)",
                  fontSize: "0.85rem",
                  padding: "8px",
                }}
              >
                {user.name}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={isActive("/login")}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
