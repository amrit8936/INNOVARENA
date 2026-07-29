import { useEffect, useState } from "react";
import api from "../services/api.js";
import HackathonCard from "../components/HackathonCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
    <div className="skeleton h-28 w-full"></div>
    <div className="p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded"></div>
      <div className="skeleton h-3 w-full rounded"></div>
      <div className="skeleton h-3 w-5/6 rounded"></div>
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-16 rounded-full"></div>
        <div className="skeleton h-6 w-16 rounded-full"></div>
      </div>
      <div className="skeleton h-9 w-full rounded-xl mt-4"></div>
    </div>
  </div>
);

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    api.get("/hackathons")
      .then(({ data }) => setHackathons(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering
  const filtered = hackathons.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch = h.title?.toLowerCase().includes(q) || h.theme?.toLowerCase().includes(q) || h.description?.toLowerCase().includes(q);
    const matchMode = filterMode ? h.mode === filterMode : true;
    const matchStatus = filterStatus ? h.status === filterStatus : true;
    return matchSearch && matchMode && matchStatus;
  });

  const activeFilters = [filterMode, filterStatus].filter(Boolean).length;

  const clearFilters = () => { setSearch(""); setFilterMode(""); setFilterStatus(""); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black mb-2">🏆 All Hackathons</h1>
          <p className="text-indigo-100">Discover events, register your team, and start building.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search + Filters bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              id="search-hackathons"
              type="text"
              placeholder="Search by title, theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5"
            />
          </div>

          {/* Mode filter */}
          <select
            id="filter-mode"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="input-field py-2.5 w-auto min-w-[140px]"
          >
            <option value="">All Modes</option>
            <option value="Online">🌐 Online</option>
            <option value="Offline">📍 Offline</option>
          </select>

          {/* Status filter */}
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field py-2.5 w-auto min-w-[150px]"
          >
            <option value="">All Status</option>
            <option value="upcoming">🔵 Upcoming</option>
            <option value="ongoing">🟢 Ongoing</option>
            <option value="completed">⚫ Completed</option>
          </select>

          {/* Clear filters */}
          {(search || activeFilters > 0) && (
            <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 hover:bg-red-50 rounded-xl transition-colors whitespace-nowrap">
              ✕ Clear
            </button>
          )}

          {/* Result count */}
          <span className="text-sm text-gray-400 ml-auto whitespace-nowrap">
            {loading ? "Loading..." : `${filtered.length} hackathon${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Active filter chips */}
        {(filterMode || filterStatus) && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {filterMode && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {filterMode} <button onClick={() => setFilterMode("")} className="ml-1 hover:text-red-500">✕</button>
              </span>
            )}
            {filterStatus && (
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                {filterStatus} <button onClick={() => setFilterStatus("")} className="ml-1 hover:text-red-500">✕</button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={hackathons.length === 0 ? "No hackathons yet" : "No results found"}
            subtitle={hackathons.length === 0 ? "Check back soon for upcoming events!" : "Try different search terms or clear your filters."}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((h, i) => (
              <div key={h._id} className={`fade-in-up`} style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
                <HackathonCard hackathon={h} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hackathons;
