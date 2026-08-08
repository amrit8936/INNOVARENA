import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import OrganizerDashboard from "./OrganizerDashboard.jsx";
import ParticipantDashboard from "./ParticipantDashboard.jsx";
import JudgeDashboard from "./JudgeDashboard.jsx";

// Main Dashboard – routes to the correct sub-dashboard based on user role
const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 fade-in">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl font-bold">Welcome, {user.name} 👋</h2>
        <p className="text-indigo-100 mt-1 capitalize">Role: {user.role}</p>
      </div>

      {/* Render correct dashboard by role */}
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "organizer" && <OrganizerDashboard userId={user.id} />}
      {user.role === "participant" && <ParticipantDashboard />}
      {user.role === "judge" && <JudgeDashboard />}
    </div>
  );
};

export default Dashboard;
