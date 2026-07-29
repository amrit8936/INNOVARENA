import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
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
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/hackathons/:id" element={<HackathonDetails />} />
        <Route path="/leaderboard/:hackathonId" element={<Leaderboard />} />

        {/* Protected routes – only logged-in users */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
        <Route path="/submit" element={<ProtectedRoute><SubmitProject /></ProtectedRoute>} />

        {/* 404 – catch all unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
