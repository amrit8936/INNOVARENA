import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

// TeamPage – participant can create a team, join a team, view their team
const TeamPage = () => {
  const { user } = useContext(AuthContext);
  const [myTeams, setMyTeams] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Create team form state
  const [createForm, setCreateForm] = useState({ teamName: "", hackathonId: "" });

  // Join team form state
  const [joinTeamId, setJoinTeamId] = useState("");

  // Load my teams and all hackathons
  useEffect(() => {
    Promise.all([api.get("/teams/my"), api.get("/hackathons")])
      .then(([teamsRes, hackRes]) => {
        setMyTeams(teamsRes.data);
        setHackathons(hackRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000); // auto-clear after 4 seconds
  };

  // Create a new team
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/teams", {
        teamName: createForm.teamName,
        hackathonId: createForm.hackathonId,
      });
      setMyTeams((prev) => [...prev, data]);
      setCreateForm({ teamName: "", hackathonId: "" });
      showMsg("✅ Team created successfully!");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to create team"));
    }
  };

  // Join a team using its ID
  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/teams/${joinTeamId}/join`);
      setMyTeams((prev) => [...prev, data]);
      setJoinTeamId("");
      showMsg("✅ Joined team successfully!");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to join team"));
    }
  };

  // Leave a team
  const handleLeave = async (teamId) => {
    try {
      await api.put(`/teams/${teamId}/leave`);
      setMyTeams((prev) => prev.filter((t) => t._id !== teamId));
      showMsg("✅ Left team.");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to leave team"));
    }
  };

  // Delete team (leader only)
  const handleDelete = async (teamId) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/teams/${teamId}`);
      setMyTeams((prev) => prev.filter((t) => t._id !== teamId));
      showMsg("✅ Team deleted.");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to delete team"));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      <h1 className="text-3xl font-bold mb-2">Team Management</h1>
      <p className="text-gray-500 mb-6">Create a new team or join an existing one for a hackathon.</p>

      {/* Flash message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 mb-6 text-sm ${message.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Create Team */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4">➕ Create a Team</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              id="team-name"
              placeholder="Team Name (e.g. Code Wizards)"
              value={createForm.teamName}
              onChange={(e) => setCreateForm({ ...createForm, teamName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
            <select
              id="team-hackathon"
              value={createForm.hackathonId}
              onChange={(e) => setCreateForm({ ...createForm, hackathonId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Select Hackathon</option>
              {hackathons.map((h) => (
                <option key={h._id} value={h._id}>{h.title}</option>
              ))}
            </select>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors">
              Create Team
            </button>
          </form>
        </div>

        {/* Join Team */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4">🔗 Join a Team</h2>
          <p className="text-sm text-gray-500 mb-3">Ask your team leader for their Team ID and paste it below.</p>
          <form onSubmit={handleJoin} className="space-y-3">
            <input
              id="join-team-id"
              placeholder="Team ID (from team leader)"
              value={joinTeamId}
              onChange={(e) => setJoinTeamId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors">
              Join Team
            </button>
          </form>
        </div>
      </div>

      {/* My Teams */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-4">My Teams ({myTeams.length})</h2>
        {myTeams.length === 0 ? (
          <EmptyState icon="🤝" title="No teams yet" subtitle="Create or join a team above to get started!" />
        ) : (
          <div className="space-y-4">
            {myTeams.map((team) => {
              const isLeader = team.leader?._id === user?.id || team.leader === user?.id;
              return (
                <div key={team._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800">{team.teamName}</p>
                        {isLeader && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Leader</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Hackathon: {team.hackathon?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Members: {team.members?.map((m) => m.name || m).join(", ")}
                      </p>
                      {/* Team ID for sharing */}
                      <p className="text-xs text-indigo-500 mt-1 font-mono">ID: {team._id}</p>
                    </div>
                    <div className="flex gap-2">
                      {isLeader ? (
                        <button
                          onClick={() => handleDelete(team._id)}
                          className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg"
                        >
                          Delete Team
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLeave(team._id)}
                          className="text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 px-3 py-1 rounded-lg"
                        >
                          Leave Team
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
