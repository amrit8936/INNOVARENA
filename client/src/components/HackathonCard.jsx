import { Link } from "react-router-dom";

// HackathonCard – card displayed in the hackathons list
const HackathonCard = ({ hackathon }) => {
  // Status badge styles
  const statusStyle = {
    upcoming:  { cls: "bg-blue-100 text-blue-700",  label: "🔵 Upcoming" },
    ongoing:   { cls: "bg-green-100 text-green-700", label: "🟢 Live Now" },
    completed: { cls: "bg-gray-100 text-gray-600",   label: "⚫ Completed" },
  };
  const status = statusStyle[hackathon.status] || statusStyle.upcoming;

  // Format a date to "27 Jul 2026"
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD";

  // Gradient based on theme keyword
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-orange-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-red-600",
  ];
  const gradIndex = (hackathon.title?.length || 0) % gradients.length;
  const gradient = gradients[gradIndex];

  return (
    <div className="bg-white rounded-2xl shadow-md card-hover overflow-hidden border border-gray-100 flex flex-col">
      {/* Top banner */}
      <div className={`bg-gradient-to-r ${gradient} p-5 text-white relative overflow-hidden`}>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-0 right-8 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        <div className="relative z-10">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white bg-opacity-20 mb-2 inline-block`}>
            {status.label}
          </span>
          <h3 className="text-lg font-black leading-tight line-clamp-2 mt-1">{hackathon.title}</h3>
          <p className="text-white text-opacity-80 text-xs mt-1">by {hackathon.organizer?.name}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{hackathon.description}</p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-full">
            🏷 {hackathon.theme || "General"}
          </span>
          <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {hackathon.mode === "Online" ? "🌐 Online" : "📍 Offline"}
          </span>
          {hackathon.prizePool && (
            <span className="bg-yellow-50 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full">
              🏆 {hackathon.prizePool}
            </span>
          )}
          <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            👥 Max {hackathon.maxTeamSize || 4}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <span>📅</span>
          <span>{fmt(hackathon.startDate)} → {fmt(hackathon.endDate)}</span>
        </div>

        {/* CTA */}
        <Link
          to={`/hackathons/${hackathon._id}`}
          className={`block text-center bg-gradient-to-r ${gradient} text-white text-sm font-bold py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
        >
          View & Register →
        </Link>
      </div>
    </div>
  );
};

export default HackathonCard;
