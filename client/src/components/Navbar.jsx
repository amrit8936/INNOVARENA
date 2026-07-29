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

  // Role-based accent color for the badge
  const roleBadgeColor = {
    admin: "bg-red-100 text-red-600",
    organizer: "bg-purple-100 text-purple-600",
    judge: "bg-yellow-100 text-yellow-700",
    participant: "bg-green-100 text-green-700",
  };

  const navLinks = user
    ? [
        { to: "/hackathons", label: "Hackathons", icon: "🏆" },
        { to: "/dashboard", label: "Dashboard", icon: "📊" },
        ...(user.role === "participant"
          ? [
              { to: "/teams", label: "My Team", icon: "🤝" },
              { to: "/submit", label: "Submit", icon: "📁" },
            ]
          : []),
        { to: "/profile", label: "Profile", icon: "👤" },
      ]
    : [
        { to: "/hackathons", label: "Hackathons", icon: "🏆" },
      ];

  return (
    <nav className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 shadow-lg sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
            <span className="text-3xl group-hover:scale-110 transition-transform animate-bounce">⚡</span>
            <span className="text-xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">INNOVARENA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative group flex items-center gap-1.5 text-sm text-gray-700 font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User info pill */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800 leading-none">{user.name}</p>
                    <span className={`text-[10px] font-medium capitalize ${roleBadgeColor[user.role] || "text-gray-500"}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-xl transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:translate-y-[-2px]"
                >
                  Sign Up → ⚡
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 mb-1 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 mb-1 ${menuOpen ? "opacity-0" : ""}`}></div>
            <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></div>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-100 pt-3 fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-3 py-2.5 rounded-xl transition-colors mb-1"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full mt-2 bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl text-sm transition-colors hover:bg-red-100"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-center bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl text-sm">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="text-center bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm">Sign Up Free</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
