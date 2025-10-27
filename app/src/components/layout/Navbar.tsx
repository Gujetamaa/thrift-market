import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { auth } from "../../lib/firebase";
import "../../css/components/navbar.css";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">EcoFit</Link>

      <nav className="navbar-links">
        <NavLink to="/listings">Browse</NavLink>
        <NavLink to="/sell">Sell</NavLink>
      </nav>

      <div className="navbar-user">
        {user ? (
          <>
            <NavLink to="/me">{user.displayName || user.email}</NavLink>
            <button onClick={() => auth.signOut()}>Logout</button>
          </>
        ) : (
          <NavLink to="/me">Login</NavLink>
        )}
      </div>
    </header>
  );
}
