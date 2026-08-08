import { Link } from "react-router-dom";

const HackathonCard = ({ hackathon }) => {
  const statusStyle = {
    upcoming: { cls: "bg-blue-100 text-blue-700", label: "Upcoming" },
    ongoing: { cls: "bg-green-100 text-green-700", label: "Live" },
    completed: { cls: "bg-slate-100 text-slate-600", label: "Completed" },
  };
  const status = statusStyle[hackathon.status] || statusStyle.upcoming;

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD";

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="rounded-lg bg-slate-900 p-4 text-white">
        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${status.cls}`}>
          {status.label}
        </span>
        <h3 className="mt-2 text-lg font-bold">{hackathon.title}</h3>
        <p className="mt-1 text-sm text-slate-300">by {hackathon.organizer?.name}</p>
      </div>

      <div className="mt-4 flex-1">
        <p className="text-sm text-slate-600">{hackathon.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700">{hackathon.theme || "General"}</span>
          <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700">
            {hackathon.mode === "Online" ? "Online" : "Offline"}
          </span>
          {hackathon.prizePool && (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">{hackathon.prizePool}</span>
          )}
        </div>

        <div className="mt-4 text-sm text-slate-500">
          <span>📅 {fmt(hackathon.startDate)} → {fmt(hackathon.endDate)}</span>
        </div>
      </div>

      <Link to={`/hackathons/${hackathon._id}`} className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-center text-sm font-semibold text-white">
        View Details
      </Link>
    </div>
  );
};

export default HackathonCard;
