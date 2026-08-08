// ─── components/ProtectedRoute.jsx ────────────────────────────────────────────
// ProtectedRoute is a wrapper component that guards private pages.
//
// How it works:
//   - If the user IS logged in → render the page normally (children)
//   - If the user is NOT logged in → redirect to /login automatically
//
// Usage in App.jsx:
//   <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

import { useContext } from "react";
import { Navigate } from "react-router-dom"; // Navigate = programmatic redirect in React Router
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  // Get the current user from the global AuthContext
  const { user } = useContext(AuthContext);

  // If user is null (not logged in), redirect them to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // User is logged in — render the page component (children)
  return children;
};

export default ProtectedRoute;
