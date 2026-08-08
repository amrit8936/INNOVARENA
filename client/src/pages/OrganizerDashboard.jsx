import { useEffect, useState } from "react";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const OrganizerDashboard = ({ userId }) => {
  const [myHackathons, setMyHackathons] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState("");
  const [loading, setLoading] = useState(true);
  const [judgeEmail, setJudgeEmail] = useState("");
  const [judgeMsg, setJudgeMsg] = useState("");
  const [winnersInput, setWinnersInput] = useState([
    { rank: 1, teamName: "", projectName: "" },
    { rank: 2, teamName: "", projectName: "" },
    { rank: 3, teamName: "", projectName: "" },
  ]);
  const [tab, setTab] = useState("hackathons"); // hackathons | registrations | submissions | judges | winners
  const [form, setForm] = useState({
    title: "", description: "", theme: "", mode: "Online",
    prizePool: "", startDate: "", endDate: "", venue: "",
    maxTeamSize: 4, rules: "", judgingCriteria: "", registrationDeadline: "",
  });

  useEffect(() => {
    api.get("/hackathons")
      .then(({ data }) => setMyHackathons(data.filter((h) => h.organizer?._id === userId)))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!selectedHackathon) return;
    api.get(`/registrations/hackathon/${selectedHackathon}`).then(({ data }) => setRegistrations(data)).catch(() => setRegistrations([]));
    api.get(`/submissions/hackathon/${selectedHackathon}`).then(({ data }) => setSubmissions(data)).catch(() => setSubmissions([]));
  }, [selectedHackathon]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/hackathons", form);
      setMyHackathons((p) => [...p, data]);
      setForm({ title: "", description: "", theme: "", mode: "Online", prizePool: "", startDate: "", endDate: "", venue: "", maxTeamSize: 4, rules: "", judgingCriteria: "", registrationDeadline: "" });
      alert("✅ Hackathon created!");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed"));
    }
  };

  const handleUpdateStatus = async (regId, status) => {
    await api.put(`/registrations/${regId}/status`, { status });
    setRegistrations((p) => p.map((r) => (r._id === regId ? { ...r, status } : r)));
  };

  const handleDeleteHackathon = async (id) => {
    if (!window.confirm("Delete hackathon?")) return;
    await api.delete(`/hackathons/${id}`);
    setMyHackathons((p) => p.filter((h) => h._id !== id));
    if (selectedHackathon === id) setSelectedHackathon("");
  };

  const handleToggleReg = async (id) => {
    const { data } = await api.put(`/hackathons/${id}/toggle-registration`);
    setMyHackathons((p) => p.map((h) => (h._id === id ? { ...h, registrationOpen: data.registrationOpen } : h)));
  };

  const handleAssignJudge = async (hackathonId) => {
    if (!judgeEmail.trim()) return;
    try {
      const { data } = await api.put(`/hackathons/${hackathonId}/assign-judge`, { email: judgeEmail });
      setJudgeMsg("✅ " + data.message);
      setJudgeEmail("");
      // Refresh hackathon list to show updated judges
      const res = await api.get("/hackathons");
      setMyHackathons(res.data.filter((h) => h.organizer?._id === userId));
    } catch (err) {
      setJudgeMsg("❌ " + (err.response?.data?.message || "Failed"));
    }
    setTimeout(() => setJudgeMsg(""), 4000);
  };

  const handleRemoveJudge = async (hackathonId, judgeId) => {
    await api.delete(`/hackathons/${hackathonId}/remove-judge/${judgeId}`);
    const res = await api.get("/hackathons");
    setMyHackathons(res.data.filter((h) => h.organizer?._id === userId));
  };

  const handlePublishWinners = async (hackathonId) => {
    const filtered = winnersInput.filter((w) => w.teamName.trim());
    if (filtered.length === 0) return alert("Enter at least one winner");
    try {
      await api.put(`/hackathons/${hackathonId}/publish-winners`, { winners: filtered });
      alert("✅ Winners published! Hackathon marked as completed.");
      const res = await api.get("/hackathons");
      setMyHackathons(res.data.filter((h) => h.organizer?._id === userId));
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed"));
    }
  };

  if (loading) return <Loader />;

  const selectedH = myHackathons.find((h) => h._id === selectedHackathon);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🏆" label="My Hackathons" value={myHackathons.length} color="bg-indigo-50" />
        <StatCard icon="📝" label="Registrations" value={registrations.length} color="bg-purple-50" />
        <StatCard icon="📁" label="Submissions" value={submissions.length} color="bg-green-50" />
        <StatCard icon="⚖️" label="Judges" value={selectedH?.judges?.length || 0} color="bg-yellow-50" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {["hackathons", "registrations", "submissions", "judges", "winners"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-xs font-semibold capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Create Hackathon Tab */}
      {tab === "hackathons" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">➕ Create New Hackathon</h3>
            <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
              {[
                { name: "title", placeholder: "Title", required: true },
                { name: "theme", placeholder: "Theme (e.g. AI, Web3)" },
                { name: "prizePool", placeholder: "Prize Pool (e.g. ₹50,000)" },
                { name: "venue", placeholder: "Venue (if offline)" },
              ].map(({ name, placeholder, required }) => (
                <input key={name} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} required={!!required}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              ))}
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-indigo-500" rows={3} />
              <textarea name="rules" placeholder="Rules" value={form.rules} onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-indigo-500" rows={2} />
              <textarea name="judgingCriteria" placeholder="Judging Criteria" value={form.judgingCriteria} onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-indigo-500" rows={2} />
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Mode</label>
                <select name="mode" value={form.mode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Max Team Size</label>
                <input name="maxTeamSize" type="number" min={1} max={10} value={form.maxTeamSize} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Registration Deadline</label>
                <input name="registrationDeadline" type="date" value={form.registrationDeadline} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors">
                Create Hackathon
              </button>
            </form>
          </div>

          {/* My Hackathons list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">My Hackathons</h3>
            {myHackathons.length === 0 ? (
              <EmptyState icon="🏆" title="No hackathons yet" subtitle="Create your first hackathon above!" />
            ) : (
              <div className="space-y-3">
                {myHackathons.map((h) => (
                  <div key={h._id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">{h.title}</p>
                        <p className="text-xs text-gray-500">{h.theme} • {h.mode} • Prize: {h.prizePool || "TBA"}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${h.registrationOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {h.registrationOpen ? "Registration Open" : "Registration Closed"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <button onClick={() => { setSelectedHackathon(h._id); setTab("registrations"); }}
                          className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-lg">
                          Registrations
                        </button>
                        <button onClick={() => handleToggleReg(h._id)}
                          className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-3 py-1 rounded-lg">
                          Toggle Reg
                        </button>
                        <button onClick={() => handleDeleteHackathon(h._id)}
                          className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Registrations Tab */}
      {tab === "registrations" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Registrations</h3>
          <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)}
            className="mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto focus:outline-none focus:border-indigo-500">
            <option value="">-- Select a Hackathon --</option>
            {myHackathons.map((h) => <option key={h._id} value={h._id}>{h.title}</option>)}
          </select>
          {!selectedHackathon ? <p className="text-gray-400 text-sm">Select a hackathon above.</p> :
            registrations.length === 0 ? <EmptyState icon="📝" title="No registrations yet" /> : (
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

      {/* Submissions Tab */}
      {tab === "submissions" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Submissions</h3>
          <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)}
            className="mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto">
            <option value="">-- Select a Hackathon --</option>
            {myHackathons.map((h) => <option key={h._id} value={h._id}>{h.title}</option>)}
          </select>
          {!selectedHackathon ? <p className="text-gray-400 text-sm">Select a hackathon above.</p> :
            submissions.length === 0 ? <EmptyState icon="📁" title="No submissions yet" /> : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <div key={s._id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{s.projectName}</p>
                        <p className="text-xs text-gray-500">Team: {s.team?.teamName}</p>
                        {s.githubLink && <a href={s.githubLink} target="_blank" rel="noreferrer" className="text-indigo-600 text-xs hover:underline">🔗 GitHub</a>}
                        {s.liveDemo && <a href={s.liveDemo} target="_blank" rel="noreferrer" className="text-indigo-600 text-xs hover:underline ml-3">🌐 Live Demo</a>}
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
                        {s.score > 0 && <p className="text-sm font-bold text-indigo-600 mt-1">Score: {s.score}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Judges Tab */}
      {tab === "judges" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">⚖️ Assign Judges</h3>
          <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)}
            className="mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto">
            <option value="">-- Select a Hackathon --</option>
            {myHackathons.map((h) => <option key={h._id} value={h._id}>{h.title}</option>)}
          </select>
          {selectedHackathon && (
            <>
              {judgeMsg && <div className={`text-sm rounded-lg px-3 py-2 mb-3 ${judgeMsg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{judgeMsg}</div>}
              <div className="flex gap-2 mb-4">
                <input value={judgeEmail} onChange={(e) => setJudgeEmail(e.target.value)}
                  placeholder="Judge's email address"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <button onClick={() => handleAssignJudge(selectedHackathon)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  Assign
                </button>
              </div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Assigned Judges:</h4>
              {!selectedH?.judges?.length ? <p className="text-gray-400 text-sm">No judges assigned yet.</p> : (
                <div className="space-y-2">
                  {selectedH.judges.map((j) => (
                    <div key={j._id || j} className="flex justify-between items-center border border-gray-100 rounded-lg p-3">
                      <div>
                        <p className="font-medium text-sm">{j.name}</p>
                        <p className="text-xs text-gray-500">{j.email}</p>
                      </div>
                      <button onClick={() => handleRemoveJudge(selectedHackathon, j._id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Winners Tab */}
      {tab === "winners" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">🏆 Publish Winners</h3>
          <select value={selectedHackathon} onChange={(e) => setSelectedHackathon(e.target.value)}
            className="mb-4 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-auto">
            <option value="">-- Select a Hackathon --</option>
            {myHackathons.map((h) => <option key={h._id} value={h._id}>{h.title}</option>)}
          </select>
          {selectedHackathon && (
            <>
              <p className="text-sm text-gray-500 mb-4">Fill in the top 3 winners and publish. This will also mark the hackathon as Completed.</p>
              {winnersInput.map((w, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-3 mb-3">
                  <input value={`Rank ${w.rank}`} readOnly className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50" />
                  <input
                    placeholder="Team Name"
                    value={w.teamName}
                    onChange={(e) => {
                      const updated = [...winnersInput];
                      updated[i].teamName = e.target.value;
                      setWinnersInput(updated);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    placeholder="Project Name"
                    value={w.projectName}
                    onChange={(e) => {
                      const updated = [...winnersInput];
                      updated[i].projectName = e.target.value;
                      setWinnersInput(updated);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
              <button onClick={() => handlePublishWinners(selectedHackathon)}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
                🏆 Publish Winners
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
