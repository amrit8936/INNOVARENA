import { useEffect, useState } from "react";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

// SubmitProject – participant submits their team's project
const SubmitProject = () => {
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    teamId: "",
    hackathonId: "",
    projectName: "",
    problemStatement: "",
    solutionDescription: "",
    githubLink: "",
    liveDemo: "",
    techStack: "",
    videoLink: "",
  });

  // Load user's teams so they can select their team
  useEffect(() => {
    api.get("/teams/my")
      .then(({ data }) => setMyTeams(data))
      .finally(() => setLoading(false));
  }, []);

  // When team is selected, auto-fill hackathonId
  const handleTeamChange = (teamId) => {
    const team = myTeams.find((t) => t._id === teamId);
    setForm({
      ...form,
      teamId,
      hackathonId: team?.hackathon?._id || team?.hackathon || "",
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await api.post("/submissions", form);
      setMessage("✅ Project submitted successfully! Check your dashboard.");
      setForm({ teamId: "", hackathonId: "", projectName: "", problemStatement: "", solutionDescription: "", githubLink: "", liveDemo: "", techStack: "", videoLink: "" });
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Submission failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (myTeams.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 fade-in">
        <EmptyState icon="🤝" title="You need a team first!" subtitle="Go to the Team page to create or join a team before submitting a project." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 fade-in">
      <h1 className="text-3xl font-bold mb-2">Submit Your Project</h1>
      <p className="text-gray-500 mb-6">Fill in all the details about your hackathon project.</p>

      {/* Flash message */}
      {message && (
        <div className={`rounded-lg px-4 py-3 mb-6 text-sm ${message.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Team *</label>
            <select
              id="submit-team"
              value={form.teamId}
              onChange={(e) => handleTeamChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Choose your team...</option>
              {myTeams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.teamName} — {t.hackathon?.title}
                </option>
              ))}
            </select>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              id="project-name"
              name="projectName"
              placeholder="e.g. SmartFarm AI"
              value={form.projectName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
            <textarea
              id="problem-statement"
              name="problemStatement"
              placeholder="What problem does your project solve?"
              value={form.problemStatement}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solution Description *</label>
            <textarea
              id="solution-desc"
              name="solutionDescription"
              placeholder="Describe your solution in detail..."
              value={form.solutionDescription}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository *</label>
            <input
              id="github-link"
              name="githubLink"
              placeholder="https://github.com/your-team/project"
              value={form.githubLink}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Live Demo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
            <input
              id="live-demo"
              name="liveDemo"
              placeholder="https://your-project.vercel.app"
              value={form.liveDemo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
            <input
              id="tech-stack"
              name="techStack"
              placeholder="e.g. React, Node.js, MongoDB, TensorFlow"
              value={form.techStack}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Demo Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Demo Video Link</label>
            <input
              id="video-link"
              name="videoLink"
              placeholder="https://youtube.com/..."
              value={form.videoLink}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            id="submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Project 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProject;
