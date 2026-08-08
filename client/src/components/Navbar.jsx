import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const navLinks = user
    ? [
        { to: "/hackathons", label: "Hackathons" },
        { to: "/dashboard", label: "Dashboard" },
        ...(user.role === "participant"
          ? [
              { to: "/teams", label: "My Team" },
              { to: "/submit", label: "Submit" },
            ]
          : []),
        { to: "/profile", label: "Profile" },
      ]
    : [{ to: "/hackathons", label: "Hackathons" }];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-800" onClick={() => setMenuOpen(false)}>
          <span className="text-xl">⚡</span>
          <span>INNOVARENA</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="px-3 py-2 rounded-lg text-sm text-slate-700">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                {user.name}
              </span>
              <button onClick={handleLogout} className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm text-slate-700">
                Login
              </Link>
              <Link to="/signup" className="rounded-lg bg-sky-600 px-3 py-2 text-sm text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden rounded-lg border border-slate-300 px-3 py-2 text-slate-700" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 px-4 py-3 bg-white">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-sm text-slate-700">
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="mt-2 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">
              Logout
            </button>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-center text-slate-700">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-lg bg-sky-600 px-3 py-2 text-sm text-center text-white">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
