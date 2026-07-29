import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

// Leaderboard page – shows ranked teams for a hackathon based on score
const Leaderboard = () => {
  const { hackathonId } = useParams(); // get hackathon ID from URL
  const [submissions, setSubmissions] = useState([]);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load submissions (already sorted by score desc from backend)
    Promise.all([
      api.get(`/submissions/hackathon/${hackathonId}`),
      api.get(`/hackathons/${hackathonId}`),
    ])
      .then(([subRes, hackRes]) => {
        setSubmissions(subRes.data);
        setHackathon(hackRes.data);
      })
      .finally(() => setLoading(false));
  }, [hackathonId]);

  // Medal emoji for top 3 positions
  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
        {hackathon && <p className="text-yellow-50 mt-1">{hackathon.title}</p>}
      </div>

      {submissions.length === 0 ? (
        <EmptyState icon="🏆" title="No results yet" subtitle="Scores will appear here after judging is complete." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-5 bg-gray-50 text-xs uppercase font-semibold text-gray-500 px-6 py-3 border-b border-gray-100">
            <span>Rank</span>
            <span className="col-span-2">Team / Project</span>
            <span>Status</span>
            <span className="text-right">Score</span>
          </div>

          {/* Table rows */}
          {submissions.map((sub, index) => (
            <div
              key={sub._id}
              className={`grid grid-cols-5 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50 transition-colors ${index === 0 ? "bg-yellow-50" : index === 1 ? "bg-gray-50" : index === 2 ? "bg-orange-50" : ""}`}
            >
              {/* Rank */}
              <div className="text-xl font-bold text-gray-700">{getMedal(index)}</div>

              {/* Team + Project Name */}
              <div className="col-span-2">
                <p className="font-semibold text-gray-800">{sub.projectName}</p>
                <p className="text-xs text-gray-500">Team: {sub.team?.teamName}</p>
              </div>

              {/* Status badge */}
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {sub.status}
                </span>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="text-lg font-bold text-indigo-600">{sub.score}</span>
                <span className="text-xs text-gray-400">/50</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
