import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const HackathonDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  useEffect(() => {
    api.get(`/hackathons/${id}`)
      .then(({ data }) => setHackathon(data))
      .catch(() => setHackathon(null))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "TBD";

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRegister = async () => {
    if (!user) return navigate("/login");
    setRegLoading(true);
    try {
      await api.post(`/registrations/${id}`);
      showToast("success", "Registered successfully! Check your dashboard.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading hackathon details...</p>
      </div>
    </div>
  );

  if (!hackathon) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Hackathon Not Found</h2>
      <Link to="/hackathons" className="text-indigo-600 hover:underline">← Back to all hackathons</Link>
    </div>
  );

  const infoGrid = [
    { label: "Theme",              value: hackathon.theme || "General",    icon: "🏷" },
    { label: "Mode",               value: hackathon.mode,                  icon: hackathon.mode === "Online" ? "🌐" : "📍" },
    { label: "Venue",              value: hackathon.venue || "Online",     icon: "📍" },
    { label: "Prize Pool",         value: hackathon.prizePool || "TBA",    icon: "🏆" },
    { label: "Max Team Size",      value: `${hackathon.maxTeamSize || 4} members`, icon: "👥" },
    { label: "Start Date",         value: fmt(hackathon.startDate),        icon: "📅" },
    { label: "End Date",           value: fmt(hackathon.endDate),          icon: "🏁" },
    { label: "Reg. Deadline",      value: fmt(hackathon.registrationDeadline), icon: "⏰" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium fade-in ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Hero banner */}
      <div className="hero-gradient text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/hackathons" className="inline-flex items-center gap-1 text-indigo-200 hover:text-white text-sm mb-6 transition-colors">
            ← Back to Hackathons
          </Link>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">{hackathon.title}</h1>
              <p className="text-indigo-100">Organized by <span className="font-bold text-white">{hackathon.organizer?.name}</span></p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${hackathon.registrationOpen ? "bg-green-400 text-green-900" : "bg-red-400 text-red-900"}`}>
                {hackathon.registrationOpen ? "🟢 Registration Open" : "🔴 Registration Closed"}
              </span>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                {hackathon.status || "upcoming"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-in">
        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {infoGrid.map((info) => (
            <div key={info.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm card-hover">
              <p className="text-xs text-gray-400 mb-1">{info.label}</p>
              <p className="text-sm font-bold text-gray-800">{info.icon} {info.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">📋</span>
            About this Hackathon
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{hackathon.description}</p>
        </div>

        {/* Rules & Criteria side by side */}
        <div className="grid md:grid-cols-2 gap-4">
          {hackathon.rules && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">📜</span>
                Rules
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{hackathon.rules}</p>
            </div>
          )}
          {hackathon.judgingCriteria && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">⚖️</span>
                Judging Criteria
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{hackathon.judgingCriteria}</p>
            </div>
          )}
        </div>

        {/* Leaderboard link if completed */}
        {hackathon.status === "completed" && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-white flex justify-between items-center">
            <div>
              <p className="font-black text-lg">🏆 Results are out!</p>
              <p className="text-yellow-50 text-sm">Check who won this hackathon.</p>
            </div>
            <Link to={`/leaderboard/${hackathon._id}`} className="bg-white text-orange-600 font-bold px-5 py-2 rounded-xl hover:bg-orange-50 transition-colors">
              View Leaderboard →
            </Link>
          </div>
        )}

        {/* Register CTA */}
        {user?.role === "participant" && hackathon.registrationOpen ? (
          <button
            id="register-btn"
            onClick={handleRegister}
            disabled={regLoading}
            className="w-full hero-gradient text-white font-black text-lg py-4 rounded-2xl btn-glow transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {regLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              <>🚀 Register for this Hackathon</>
            )}
          </button>
        ) : !user ? (
          <div className="text-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <p className="text-gray-500 mb-3">Login to register for this hackathon</p>
            <Link to="/login" className="bg-indigo-600 text-white font-bold px-8 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors inline-block btn-glow">
              Login to Register
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HackathonDetails;
