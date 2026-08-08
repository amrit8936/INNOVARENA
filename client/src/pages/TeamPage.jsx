import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

// TeamPage – participant can create, join, leave, delete, and transfer leadership
const TeamPage = () => {
  const { user } = useContext(AuthContext);
  const [myTeams, setMyTeams] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Create team form
  const [createForm, setCreateForm] = useState({ teamName: "", hackathonId: "" });

  // Join team form
  const [joinTeamId, setJoinTeamId] = useState("");

  // Transfer leader state: { teamId, newLeaderId }
  const [transferModal, setTransferModal] = useState(null);

  // Load my teams and all hackathons on mount
  useEffect(() => {
    Promise.all([api.get("/teams/my"), api.get("/hackathons")])
      .then(([teamsRes, hackRes]) => {
        setMyTeams(teamsRes.data);
        setHackathons(hackRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Show flash message that auto-disappears
  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // Create a new team
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.teamName.trim()) return showMsg("❌ Team name is required");
    if (!createForm.hackathonId) return showMsg("❌ Please select a hackathon");
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

  // Join an existing team using its ID
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinTeamId.trim()) return showMsg("❌ Please enter a team ID");
    try {
      const { data } = await api.put(`/teams/${joinTeamId}/join`);
      // Refresh my teams to get populated data
      const { data: refreshed } = await api.get("/teams/my");
      setMyTeams(refreshed);
      setJoinTeamId("");
      showMsg("✅ Joined team successfully!");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to join team"));
    }
  };

  // Leave a team (non-leaders only)
  const handleLeave = async (teamId) => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    try {
      await api.put(`/teams/${teamId}/leave`);
      setMyTeams((prev) => prev.filter((t) => t._id !== teamId));
      showMsg("✅ Left team successfully.");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to leave team"));
    }
  };

  // Delete team (leader only)
  const handleDelete = async (teamId) => {
    if (!window.confirm("Delete this team? This cannot be undone.")) return;
    try {
      await api.delete(`/teams/${teamId}`);
      setMyTeams((prev) => prev.filter((t) => t._id !== teamId));
      showMsg("✅ Team deleted.");
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to delete team"));
    }
  };

  // Transfer leadership to a chosen member
  const handleTransferLeader = async () => {
    if (!transferModal?.newLeaderId) return showMsg("❌ Please select a new leader");
    try {
      await api.put(`/teams/${transferModal.teamId}/transfer-leader`, {
        newLeaderId: transferModal.newLeaderId,
      });
      showMsg("✅ Leadership transferred successfully!");
      setTransferModal(null);
      // Refresh teams
      const { data } = await api.get("/teams/my");
      setMyTeams(data);
    } catch (err) {
      showMsg("❌ " + (err.response?.data?.message || "Failed to transfer leadership"));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      <h1 className="text-3xl font-bold mb-2">Team Management 🤝</h1>
      <p className="text-gray-500 mb-6">Create a new team or join an existing one for a hackathon.</p>

      {/* Flash message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 mb-6 text-sm font-medium ${
          message.startsWith("✅")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* Transfer Leader Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-lg mb-2">Transfer Leadership</h3>
            <p className="text-sm text-gray-500 mb-4">
              Select a member to become the new team leader. You will become a regular member.
            </p>
            <select
              id="new-leader-select"
              value={transferModal.newLeaderId}
              onChange={(e) => setTransferModal({ ...transferModal, newLeaderId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select new leader...</option>
              {transferModal.members
                .filter((m) => (m._id || m) !== user?.id)
                .map((m) => (
                  <option key={m._id || m} value={m._id || m}>
                    {m.name || m}
                  </option>
                ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleTransferLeader}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                Confirm Transfer
              </button>
              <button
                onClick={() => setTransferModal(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
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
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Create Team
            </button>
          </form>
        </div>

        {/* Join Team */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4">🔗 Join a Team</h2>
          <p className="text-sm text-gray-500 mb-3">
            Ask your team leader for their Team ID and paste it below.
          </p>
          <form onSubmit={handleJoin} className="space-y-3">
            <input
              id="join-team-id"
              placeholder="Team ID (from team leader)"
              value={joinTeamId}
              onChange={(e) => setJoinTeamId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-mono"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
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
              // Check if current user is the leader
              const leaderId = team.leader?._id || team.leader;
              const isLeader = leaderId === user?.id || leaderId?.toString() === user?.id;
              return (
                <div key={team._id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-800">{team.teamName}</p>
                        {isLeader && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                            👑 Leader
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          team.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : team.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {team.status || "pending"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Hackathon: {team.hackathon?.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Members ({team.members?.length || 0}):{" "}
                        {team.members?.map((m) => m.name || m).join(", ") || "Just you"}
                      </p>
                      {/* Share team ID */}
                      <p className="text-xs text-indigo-500 mt-1 font-mono">
                        Team ID: {team._id}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isLeader ? (
                        <>
                          {/* Transfer leadership button */}
                          {team.members?.length > 1 && (
                            <button
                              onClick={() => setTransferModal({
                                teamId: team._id,
                                newLeaderId: "",
                                members: team.members,
                              })}
                              className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg whitespace-nowrap"
                            >
                              Transfer Leader
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(team._id)}
                            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg"
                          >
                            Delete Team
                          </button>
                        </>
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
