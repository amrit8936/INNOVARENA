import { useEffect, useState } from "react";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const ParticipantDashboard = () => {
  const [myTeams, setMyTeams] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/teams/my"),
      api.get("/submissions/my"),
      api.get("/registrations/my"),
    ]).then(([teamsRes, subRes, regRes]) => {
      setMyTeams(teamsRes.data);
      setMySubmissions(subRes.data);
      setMyRegistrations(regRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // Cancel a registration
  const handleCancelRegistration = async (hackathonId) => {
    if (!window.confirm("Cancel your registration for this hackathon?")) return;
    try {
      await api.delete(`/registrations/${hackathonId}/cancel`);
      setMyRegistrations((p) => p.filter((r) => r.hackathon?._id !== hackathonId));
      showMsg("✅ Registration cancelled.");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to cancel"));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="📋" label="Registrations" value={myRegistrations.length} color="bg-blue-50" />
        <StatCard icon="🤝" label="My Teams" value={myTeams.length} color="bg-indigo-50" />
        <StatCard icon="📁" label="Submissions" value={mySubmissions.length} color="bg-green-50" />
      </div>

      {/* Registered Hackathons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Registered Hackathons</h3>
        {myRegistrations.length === 0 ? (
          <EmptyState icon="📋" title="No registrations yet" subtitle="Find a hackathon and register!" />
        ) : (
          <div className="space-y-2">
            {myRegistrations.map((r) => (
              <div key={r._id} className="flex justify-between items-center border border-gray-100 rounded-lg p-3">
                <div>
                  <p className="font-semibold text-sm">{r.hackathon?.title}</p>
                  <p className="text-xs text-gray-500">{r.hackathon?.mode} • {r.hackathon?.theme}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {r.status}
                  </span>
                  {r.status === "pending" && (
                    <button
                      onClick={() => handleCancelRegistration(r.hackathon?._id)}
                      className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Teams */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">My Teams</h3>
        {myTeams.length === 0 ? (
          <EmptyState icon="🤝" title="No teams yet" subtitle="Go to Team Management to create or join a team!" />
        ) : (
          <div className="space-y-2">
            {myTeams.map((t) => (
              <div key={t._id} className="border border-gray-100 rounded-lg p-4">
                <p className="font-semibold">{t.teamName}</p>
                <p className="text-xs text-gray-500">Hackathon: {t.hackathon?.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Members: {t.members?.map((m) => m.name).join(", ") || "Just you"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Submissions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">My Submissions</h3>
        {mySubmissions.length === 0 ? (
          <EmptyState icon="📁" title="No submissions yet" subtitle="Submit your project from the Submit page!" />
        ) : (
          <div className="space-y-2">
            {mySubmissions.map((s) => (
              <div key={s._id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{s.projectName}</p>
                    <p className="text-xs text-gray-500">Hackathon: {s.hackathon?.title}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "approved" ? "bg-green-100 text-green-700" : s.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {s.status}
                    </span>
                    {s.score > 0 && <p className="text-sm font-bold text-indigo-600 mt-1">Score: {s.score}/50</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantDashboard;
