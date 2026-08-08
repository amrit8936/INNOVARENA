import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import HackathonCard from "../components/HackathonCard.jsx";

const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/hackathons")
      .then(({ data }) => setHackathons(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: "", title: "Team Up", desc: "Create or join teams with students from any college." },
    { icon: "", title: "Innovate", desc: "Solve real-world problems and build products that matter." },
    { icon: "", title: "Win Prizes", desc: "Compete for exciting prizes and recognition." },
    { icon: "", title: "Fair Judging", desc: "Expert judges score your project on 5 criteria." },
  ];

  const stats = [
    { icon: "", value: "50+", label: "Hackathons Hosted" },
    { icon: "", value: "1200+", label: "Participants" },
    { icon: "", value: "300+", label: "Projects Submitted" },
    { icon: "", value: "40+", label: "Colleges" },
  ];

  return (
    <div className="bg-slate-50 text-slate-800">
      <section className="bg-sky-700 px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">Registration is open</p>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Build ideas. Join teams. Win prizes.</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-sky-100">
            INNOVARENA helps students discover hackathons, form teams, and submit projects in one simple place.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/hackathons" className="rounded-lg bg-white px-6 py-3 font-semibold text-sky-700">
              Explore Hackathons
            </Link>
            <Link to="/signup" className="rounded-lg border border-white px-6 py-3 font-semibold text-white">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mb-3 text-4xl">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Featured Hackathons</h2>
            <p className="mt-2 text-slate-600">Pick an event and start building today.</p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 h-4 w-full rounded bg-slate-200" />
                  <div className="mb-2 h-20 w-full rounded bg-slate-100" />
                  <div className="h-8 w-1/2 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No hackathons yet. Be the first organizer.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {hackathons.map((hackathon) => (
                <HackathonCard key={hackathon._id} hackathon={hackathon} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/hackathons" className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white">
              View All Hackathons
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Why INNOVARENA?</h2>
            <p className="mt-2 text-slate-600">Everything you need to start and succeed.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { title: "Sign Up", desc: "Create your account" },
              { title: "Find Event", desc: "Choose a hackathon" },
              { title: "Build", desc: "Form a team and create" },
              { title: "Submit", desc: "Share your project" },
            ].map((step) => (
              <div key={step.title} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 px-4 py-10 text-slate-300">
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="text-xl font-semibold text-white">INNOVARENA</h3>
          <p className="mt-2 text-sm">One platform for every hackathon.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/hackathons" className="text-slate-300">Hackathons</Link>
            <Link to="/login" className="text-slate-300">Login</Link>
            <Link to="/signup" className="text-slate-300">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
