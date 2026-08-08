// ─── context/AuthContext.jsx ──────────────────────────────────────────────────
// AuthContext = Global state for user authentication
//
// React Context lets us share data (like the logged-in user) across ALL
// components without passing props manually through every level.
//
// How it works:
//   1. AuthProvider wraps the whole app (in main.jsx)
//   2. Any component can call useContext(AuthContext) to get: user, login, logout

import { createContext, useState } from "react";

// createContext() creates the context object
// We'll use AuthContext.Provider to share data and useContext(AuthContext) to read it
export const AuthContext = createContext();

// AuthProvider = the component that provides the auth state to all children
export const AuthProvider = ({ children }) => {

  // useState with a function (lazy initialization):
  // On first render, read "user" from localStorage (so login persists on page refresh)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    // If there's a saved user, parse it from JSON string → object
    return saved ? JSON.parse(saved) : null; // null means "not logged in"
  });

  // login() — called after successful signup or login
  // Saves the token and user info to localStorage AND updates React state
  const login = (userData, token) => {
    localStorage.setItem("token", token);              // Save token for API calls
    localStorage.setItem("user", JSON.stringify(userData)); // Save user info
    setUser(userData);                                 // Update React state
  };

  // logout() — clears everything and sets user to null
  const logout = () => {
    localStorage.removeItem("token"); // Delete token
    localStorage.removeItem("user");  // Delete saved user
    setUser(null);                    // Update React state → user is now null
  };

  // Provide user, login, logout to every component inside the Provider
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
