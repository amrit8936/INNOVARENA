import { useEffect, useState } from "react";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

const JudgeDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/submissions")
      .then(({ data }) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  const handleScoreChange = (subId, field, value) => {
    setScores((prev) => ({ ...prev, [subId]: { ...prev[subId], [field]: Number(value) } }));
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
      alert("❌ " + (err.response?.data?.message || "Failed"));
    }
  };

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");
  const criteria = ["innovation", "technical", "design", "functionality", "presentation"];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="📋" label="Total Assigned" value={submissions.length} color="bg-blue-50" />
        <StatCard icon="⏳" label="Pending Reviews" value={pending.length} color="bg-yellow-50" />
        <StatCard icon="✅" label="Completed" value={reviewed.length} color="bg-green-50" />
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">⏳ Pending Reviews ({pending.length})</h3>
        {pending.length === 0 ? (
          <EmptyState icon="✅" title="All reviews done!" subtitle="No pending submissions." />
        ) : (
          <div className="space-y-6">
            {pending.map((sub) => {
              const s = scores[sub._id] || {};
              return (
                <div key={sub._id} className="border border-gray-200 rounded-xl p-5">
                  <p className="font-bold text-lg">{sub.projectName}</p>
                  <p className="text-sm text-gray-500 mb-1">Team: {sub.team?.teamName}</p>
                  <p className="text-sm text-gray-500 mb-2">Hackathon: {sub.hackathon?.title}</p>
                  {sub.githubLink && <a href={sub.githubLink} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm hover:underline">🔗 GitHub</a>}
                  {sub.liveDemo && <a href={sub.liveDemo} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm hover:underline ml-3">🌐 Live Demo</a>}

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                    {criteria.map((c) => (
                      <div key={c}>
                        <label className="text-xs text-gray-500 capitalize block mb-1">{c} /10</label>
                        <input type="number" min={0} max={10} value={s[c] || ""} placeholder="0"
                          onChange={(e) => handleScoreChange(sub._id, c, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea placeholder="Feedback / comments..." value={s.feedback || ""}
                    onChange={(e) => handleScoreChange(sub._id, "feedback", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-3 focus:outline-none focus:border-indigo-500" rows={2}
                  />

                  <button onClick={() => handleSubmitReview(sub)}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                    Submit Review
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed */}
      {reviewed.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">✅ Completed Reviews ({reviewed.length})</h3>
          <div className="space-y-2">
            {reviewed.map((sub) => (
              <div key={sub._id} className="border border-gray-100 rounded-lg p-3 flex justify-between">
                <div>
                  <p className="font-medium text-sm">{sub.projectName}</p>
                  <p className="text-xs text-gray-500">Team: {sub.team?.teamName} • {sub.hackathon?.title}</p>
                </div>
                <p className="font-bold text-indigo-600">Score: {sub.score}/50</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JudgeDashboard;
