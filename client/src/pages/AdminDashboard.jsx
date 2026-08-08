import { useEffect, useState } from "react";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("users"); // users | teams | submissions
  const [editUser, setEditUser] = useState(null); // user being edited

  useEffect(() => {
    Promise.all([
      api.get("/auth/stats"),
      api.get("/auth/users"),
      api.get("/teams"),
      api.get("/submissions"),
    ])
      .then(([sRes, uRes, tRes, subRes]) => {
        setStats(sRes.data);
        setUsers(uRes.data);
        setTeams(tRes.data);
        setSubmissions(subRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/auth/users/${id}`);
    setUsers((p) => p.filter((u) => u._id !== id));
  };

  const handleBlock = async (id) => {
    const { data } = await api.put(`/auth/users/${id}/block`);
    setUsers((p) => p.map((u) => (u._id === id ? { ...u, isBlocked: data.isBlocked } : u)));
  };

  const handleEditSave = async () => {
    const { data } = await api.put(`/auth/users/${editUser._id}`, {
      name: editUser.name,
      role: editUser.role,
      college: editUser.college,
    });
    setUsers((p) => p.map((u) => (u._id === data._id ? data : u)));
    setEditUser(null);
  };

  if (loading) return <Loader />;

  return (
    <div>
      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-lg mb-4">Edit User</h3>
            <div className="space-y-3">
              <input
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <select
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
                <option value="judge">Judge</option>
                <option value="admin">Admin</option>
              </select>
              <input
                value={editUser.college || ""}
                onChange={(e) => setEditUser({ ...editUser, college: e.target.value })}
                placeholder="College"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleEditSave} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">Save</button>
              <button onClick={() => setEditUser(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-50" />
        <StatCard icon="🏆" label="Hackathons" value={stats?.totalHackathons || 0} color="bg-indigo-50" />
        <StatCard icon="🤝" label="Teams" value={stats?.totalTeams || 0} color="bg-purple-50" />
        <StatCard icon="📁" label="Submissions" value={stats?.totalSubmissions || 0} color="bg-green-50" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {["users", "teams", "submissions"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "users" ? `👥 Users (${users.length})` : t === "teams" ? `🤝 Teams (${teams.length})` : `📁 Submissions (${submissions.length})`}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {tab === "users" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {users.length === 0 ? <EmptyState icon="👥" title="No users yet" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {u.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={() => setEditUser(u)} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg">Edit</button>
                        <button onClick={() => handleBlock(u._id)} className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-3 py-1 rounded-lg">
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button onClick={() => handleDelete(u._id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Teams Table */}
      {tab === "teams" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {teams.length === 0 ? <EmptyState icon="🤝" title="No teams yet" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Team Name</th>
                    <th className="text-left px-4 py-3">Hackathon</th>
                    <th className="text-left px-4 py-3">Leader</th>
                    <th className="text-left px-4 py-3">Members</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {teams.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{t.teamName}</td>
                      <td className="px-4 py-3 text-gray-500">{t.hackathon?.title}</td>
                      <td className="px-4 py-3">{t.leader?.name}</td>
                      <td className="px-4 py-3 text-gray-500">{t.members?.length || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          t.status === "approved" ? "bg-green-100 text-green-700" :
                          t.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{t.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Submissions Table */}
      {tab === "submissions" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {submissions.length === 0 ? <EmptyState icon="📁" title="No submissions yet" /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Project</th>
                    <th className="text-left px-4 py-3">Team</th>
                    <th className="text-left px-4 py-3">Hackathon</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submissions.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{s.projectName}</td>
                      <td className="px-4 py-3 text-gray-500">{s.team?.teamName}</td>
                      <td className="px-4 py-3 text-gray-500">{s.hackathon?.title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          s.status === "approved" ? "bg-green-100 text-green-700" :
                          s.status === "rejected" ? "bg-red-100 text-red-700" :
                          s.status === "under_review" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-indigo-600">{s.score || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
