// ─── App.jsx ──────────────────────────────────────────────────────────────────
// App.jsx is the ROOT component of the React application.
// It defines all the ROUTES (URL paths) and which component to show for each path.
// React Router DOM is used for client-side routing (no page reload on navigation).

import { Routes, Route } from "react-router-dom"; // React Router for navigation
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Redirects if not logged in

// ── Page Imports ───────────────────────────────────────────────────────────────
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Hackathons from "./pages/Hackathons.jsx";
import HackathonDetails from "./pages/HackathonDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import SubmitProject from "./pages/SubmitProject.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div>
      {/* Navbar shows on every page */}
      <Navbar />

      {/* Routes – only ONE route matches at a time */}
      <Routes>

        {/* ── Public Routes (anyone can access) ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/hackathons/:id" element={<HackathonDetails />} />
        <Route path="/leaderboard/:hackathonId" element={<Leaderboard />} />

        {/* ── Protected Routes (user must be logged in) ── */}
        {/* ProtectedRoute checks if there's a user in AuthContext.
            If not logged in → redirects to /login */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/teams"     element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
        <Route path="/submit"    element={<ProtectedRoute><SubmitProject /></ProtectedRoute>} />

        {/* 404 – catch all unknown routes */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </div>
  );
}

export default App;
