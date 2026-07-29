import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

// ─── Admin Dashboard ────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/auth/stats"), api.get("/auth/users")])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/auth/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleBlock = async (id) => {
    const { data } = await api.put(`/auth/users/${id}/block`);
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isBlocked: data.isBlocked } : u))
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users" value={stats?.totalUsers || 0} color="bg-blue-50" />
        <StatCard icon="🏆" label="Hackathons" value={stats?.totalHackathons || 0} color="bg-indigo-50" />
        <StatCard icon="🤝" label="Teams" value={stats?.totalTeams || 0} color="bg-purple-50" />
        <StatCard icon="📁" label="Submissions" value={stats?.totalSubmissions || 0} color="bg-green-50" />
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Manage Users ({users.length})</h3>
        </div>
        {users.length === 0 ? (
          <EmptyState icon="👥" title="No users yet" />
        ) : (
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
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleBlock(u._id)}
                        className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-3 py-1 rounded-lg"
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Organizer Dashboard ─────────────────────────────────────────────────────
const OrganizerDashboard = ({ userId }) => {
  const [myHackathons, setMyHackathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", description: "", theme: "", mode: "Online",
    prizePool: "", startDate: "", endDate: "", venue: "",
    maxTeamSize: 4, rules: "", judgingCriteria: "", registrationDeadline: "",
  });

  useEffect(() => {
    api.get("/hackathons")
      .then(({ data }) => {
        // Filter only MY hackathons
        setMyHackathons(data.filter((h) => h.organizer?._id === userId));
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // When a hackathon is selected, load its registrations
  useEffect(() => {
    if (!selectedHackathon) return;
    api.get(`/registrations/hackathon/${selectedHackathon}`)
      .then(({ data }) => setRegistrations(data))
      .catch(() => setRegistrations([]));
  }, [selectedHackathon]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await api.post("/hackathons", form);
    setMyHackathons((prev) => [...prev, data]);
    setForm({ title: "", description: "", theme: "", mode: "Online", prizePool: "", startDate: "", endDate: "", venue: "", maxTeamSize: 4, rules: "", judgingCriteria: "", registrationDeadline: "" });
    alert("✅ Hackathon created!");
  };

  const handleUpdateStatus = async (regId, status) => {
    await api.put(`/registrations/${regId}/status`, { status });
    setRegistrations((prev) =>
      prev.map((r) => (r._id === regId ? { ...r, status } : r))
    );
  };

  const handleDeleteHackathon = async (id) => {
    if (!window.confirm("Delete this hackathon?")) return;
    await api.delete(`/hackathons/${id}`);
    setMyHackathons((prev) => prev.filter((h) => h._id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="🏆" label="My Hackathons" value={myHackathons.length} color="bg-indigo-50" />
        <StatCard icon="📝" label="Registrations" value={registrations.length} color="bg-purple-50" />
      </div>

      {/* Create Hackathon Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">➕ Create New Hackathon</h3>
        <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
          {[
            { name: "title", placeholder: "Title", required: true },
            { name: "theme", placeholder: "Theme (e.g. AI, Web3)" },
            { name: "prizePool", placeholder: "Prize Pool (e.g. ₹50,000)" },
            { name: "venue", placeholder: "Venue (if offline)" },
          ].map(({ name, placeholder, required }) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              required={required}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          ))}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-indigo-500"
            rows={3}
          />
          <textarea
            name="rules"
            placeholder="Rules"
            value={form.rules}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-indigo-500"
            rows={2}
          />
          <textarea
            name="judgingCriteria"
            placeholder="Judging Criteria"
            value={form.judgingCriteria}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-indigo-500"
            rows={2}
          />

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Team Size</label>
            <input name="maxTeamSize" type="number" min={1} max={10} value={form.maxTeamSize} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Registration Deadline</label>
            <input name="registrationDeadline" type="date" value={form.registrationDeadline} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
          </div>

          <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
            Create Hackathon
          </button>
        </form>
      </div>

      {/* My Hackathons List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">My Hackathons</h3>
        {myHackathons.length === 0 ? (
          <EmptyState icon="🏆" title="No hackathons yet" subtitle="Create your first hackathon above!" />
        ) : (
          <div className="space-y-3">
            {myHackathons.map((h) => (
              <div key={h._id} className="flex justify-between items-center border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{h.title}</p>
                  <p className="text-xs text-gray-500">{h.theme} • {h.mode} • Prize: {h.prizePool || "TBA"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedHackathon(h._id)}
                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-lg"
                  >
                    Registrations
                  </button>
                  <button
                    onClick={() => handleDeleteHackathon(h._id)}
                    className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registrations for selected hackathon */}
      {selectedHackathon && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Registrations</h3>
          {registrations.length === 0 ? (
            <EmptyState icon="📝" title="No registrations yet" />
          ) : (
            <div className="space-y-2">
              {registrations.map((r) => (
                <div key={r._id} className="flex justify-between items-center border border-gray-100 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-sm">{r.user?.name}</p>
                    <p className="text-xs text-gray-500">{r.user?.email} • {r.user?.college}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {r.status}
                    </span>
                    {r.status === "pending" && (
                      <>
                        <button onClick={() => handleUpdateStatus(r._id, "approved")} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">✓ Approve</button>
                        <button onClick={() => handleUpdateStatus(r._id, "rejected")} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">✗ Reject</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Participant Dashboard ────────────────────────────────────────────────────
const ParticipantDashboard = () => {
  const [myTeams, setMyTeams] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
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
                <span className={`text-xs px-2 py-1 rounded-full ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Teams */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">My Teams</h3>
        {myTeams.length === 0 ? (
          <EmptyState icon="🤝" title="No teams yet" subtitle="Go to the Team page to create or join a team!" />
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
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
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

// ─── Judge Dashboard ──────────────────────────────────────────────────────────
const JudgeDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [scores, setScores] = useState({}); // { submissionId: { innovation, technical, ... } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/submissions")
      .then(({ data }) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  const handleScoreChange = (subId, field, value) => {
    setScores((prev) => ({
      ...prev,
      [subId]: { ...prev[subId], [field]: Number(value) },
    }));
  };

  const handleSubmitReview = async (submission) => {
    const s = scores[submission._id] || {};
    const payload = {
      submissionId: submission._id,
      hackathonId: submission.hackathon?._id || submission.hackathon,
      innovation: s.innovation || 0,
      technical: s.technical || 0,
      design: s.design || 0,
      functionality: s.functionality || 0,
      presentation: s.presentation || 0,
      feedback: s.feedback || "",
    };
    try {
      await api.post("/reviews", payload);
      setSubmissions((prev) =>
        prev.map((sub) => sub._id === submission._id ? { ...sub, status: "approved" } : sub)
      );
      alert("✅ Review submitted!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed"));
    }
  };

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard icon="⏳" label="Pending Reviews" value={pending.length} color="bg-yellow-50" />
        <StatCard icon="✅" label="Completed Reviews" value={reviewed.length} color="bg-green-50" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Submissions to Review</h3>
        {pending.length === 0 ? (
          <EmptyState icon="✅" title="All reviews done!" subtitle="No pending submissions." />
        ) : (
          <div className="space-y-6">
            {pending.map((sub) => {
              const s = scores[sub._id] || {};
              const criteria = ["innovation", "technical", "design", "functionality", "presentation"];
              return (
                <div key={sub._id} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-bold text-lg">{sub.projectName}</p>
                  <p className="text-sm text-gray-500 mb-1">Team: {sub.team?.teamName}</p>
                  <p className="text-sm text-gray-500 mb-1">Hackathon: {sub.hackathon?.title}</p>
                  {sub.githubLink && (
                    <a href={sub.githubLink} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm hover:underline">
                      🔗 View GitHub
                    </a>
                  )}

                  {/* Score inputs (each out of 10) */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                    {criteria.map((c) => (
                      <div key={c}>
                        <label className="text-xs text-gray-500 capitalize block mb-1">{c} /10</label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={s[c] || ""}
                          onChange={(e) => handleScoreChange(sub._id, c, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea
                    placeholder="Feedback / comments..."
                    value={s.feedback || ""}
                    onChange={(e) => handleScoreChange(sub._id, "feedback", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-3 focus:outline-none focus:border-indigo-500"
                    rows={2}
                  />

                  <button
                    onClick={() => handleSubmitReview(sub)}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Dashboard (role router) ─────────────────────────────────────────────
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

      {/* Render the correct dashboard based on user role */}
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "organizer" && <OrganizerDashboard userId={user.id} />}
      {user.role === "participant" && <ParticipantDashboard />}
      {user.role === "judge" && <JudgeDashboard />}
    </div>
  );
};

export default Dashboard;
