import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import HackathonCard from "../components/HackathonCard.jsx";

// ─── Animated Counter ─────────────────────────────────────────────────────────
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 20);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Home Page ────────────────────────────────────────────────────────────────
const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/hackathons")
      .then(({ data }) => setHackathons(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const features = [
    { icon: "🤝", title: "Team Up", desc: "Create or join teams with students from any college.", color: "from-indigo-500 to-blue-500" },
    { icon: "💡", title: "Innovate", desc: "Solve real-world problems and build products that matter.", color: "from-purple-500 to-pink-500" },
    { icon: "🏆", title: "Win Prizes", desc: "Compete for exciting prizes and recognition.", color: "from-orange-400 to-yellow-500" },
    { icon: "⚖️", title: "Fair Judging", desc: "Expert judges score your project on 5 criteria.", color: "from-emerald-500 to-teal-500" },
  ];

  const stats = [
    { icon: "🏆", value: 50, suffix: "+", label: "Hackathons Hosted" },
    { icon: "👨‍💻", value: 1200, suffix: "+", label: "Participants" },
    { icon: "📁", value: 300, suffix: "+", label: "Projects Submitted" },
    { icon: "🎓", value: 40, suffix: "+", label: "Colleges" },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ══════════ HERO SECTION ══════════ */}
      <section className="hero-gradient relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-15 backdrop-blur-md border border-white border-opacity-20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 fade-in-up">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Registration Now Open
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight fade-in-up delay-100">
            Create.
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"> Innovate.</span> Win. ⚡
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto fade-in-up delay-200">
            INNOVARENA is the <strong>ultimate platform</strong> for discovering, organizing, and winning hackathons — all in one place. No more chaos.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap fade-in-up delay-300">
            <Link
              to="/hackathons"
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-cyan-50 transition-all duration-300 shadow-2xl text-lg transform hover:scale-105 hover:shadow-cyan-500/50"
            >
              Explore Hackathons →
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white border-opacity-50 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white hover:bg-opacity-20 transition-all duration-300 text-lg backdrop-blur-sm transform hover:scale-105"
            >
              Join Free ⚡
            </Link>
          </div>

          {/* Floating emoji decorations */}
          <div className="mt-16 flex justify-center gap-8 fade-in-up delay-400">
            {["💻", "🎯", "🤖", "🛠️", "🌐"].map((emoji, i) => (
              <span
                key={i}
                className="text-4xl opacity-70 drop-shadow-lg"
                style={{ animation: `float ${2.5 + i * 0.3}s ease-in-out infinite` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Wave at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent font-bold text-sm uppercase tracking-widest">By the Numbers</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 card-hover fade-in-up`}>
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-gray-600 mt-2 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED HACKATHONS ══════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              🔥 Hot Events
            </span>
            <h2 className="text-5xl font-black mt-4 mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Featured Hackathons</h2>
            <p className="text-gray-600 text-lg">Discover amazing events and showcase your innovation</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="skeleton h-4 mb-4 w-full"></div>
                  <div className="skeleton h-20 mb-3 w-full"></div>
                  <div className="skeleton h-8 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : hackathons.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">🚀</div>
              <p>No hackathons yet. Be the first organizer!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {hackathons.map((h, i) => (
                <div key={h._id} className={`fade-in-up delay-${(i + 1) * 100}`}>
                  <HackathonCard hackathon={h} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/hackathons"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
            >
              View All Hackathons
              <span className="text-2xl">\u2192</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ WHY INNOVARENA ══════════ */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Why INNOVARENA?</h2>
            <p className="text-gray-600 text-lg">Everything you need to succeed, on one platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className={`relative overflow-hidden rounded-2xl p-7 card-hover cursor-default fade-in-up bg-white border-2 border-gray-100 hover:border-transparent group shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                {/* Gradient blob on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r from-blue-600 to-purple-600 group-hover:bg-clip-text transition-all">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-4 text-white">How It Works</h2>
          <p className="text-blue-100 mb-14 text-lg">Get started in just 4 simple steps</p>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Sign Up", desc: "Create your free account as a Participant, Organizer, or Judge.", icon: "📝" },
              { step: "02", title: "Find Event", desc: "Browse hackathons and register for ones that interest you.", icon: "🔍" },
              { step: "03", title: "Build & Submit", desc: "Form a team, build your project, and submit before the deadline.", icon: "🛠️" },
              { step: "04", title: "Get Judged", desc: "Expert judges evaluate and rank your project on the leaderboard.", icon: "🏆" },
            ].map((item, i) => (
              <div key={item.step} className={`relative fade-in-up delay-${(i + 1) * 100}`}>
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-indigo-200 z-0" style={{ width: "100%" }}></div>
                )}
                <div className="relative z-10 bg-white rounded-2xl p-5 shadow-sm card-hover">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-xs font-bold text-indigo-400 mb-1">{item.step}</div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA BANNER ══════════ */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-7xl mb-4 inline-block drop-shadow-lg" style={{ animation: 'float 3s ease-in-out infinite' }}>⚡</div>
          <h2 className="text-5xl font-black mb-4">Ready to Innovate?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of innovators already building on INNOVARENA.</p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-black px-10 py-5 rounded-2xl text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] inline-block transform hover:scale-110"
          >
            Get Started — Free ⚡
          </Link>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-14 px-4 border-t border-gray-700">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="text-3xl font-black text-white mb-2">
                ⚡ <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">INNOVARENA</span>
              </div>
              <p className="text-sm text-gray-400">One platform for every hackathon.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link to="/hackathons" className="hover:text-cyan-400 transition-colors block">Hackathons</Link>
                <Link to="/login" className="hover:text-cyan-400 transition-colors block">Login</Link>
                <Link to="/signup" className="hover:text-cyan-400 transition-colors block">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Community</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="hover:text-cyan-400 transition-colors block">Discord</a>
                <a href="#" className="hover:text-cyan-400 transition-colors block">Twitter</a>
                <a href="#" className="hover:text-cyan-400 transition-colors block">LinkedIn</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Resources</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="hover:text-cyan-400 transition-colors block">Docs</a>
                <a href="#" className="hover:text-cyan-400 transition-colors block">Support</a>
                <a href="#" className="hover:text-cyan-400 transition-colors block">Status</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-center text-sm text-gray-400">© 2026 INNOVARENA. All rights reserved. Built with ❤️ using MERN Stack.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
