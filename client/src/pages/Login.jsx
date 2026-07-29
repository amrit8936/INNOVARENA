import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 hero-gradient text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-black mb-4">Welcome Back!</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-sm">
            Sign in to access your dashboard, manage teams, and submit projects.
          </p>
          {/* Mini feature list */}
          {["Role-based dashboards", "Team management", "Project submissions", "Live leaderboard"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-indigo-100 mb-2 text-sm">
              <span className="text-green-300">✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-black">
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">INNOVARENA</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h1 className="text-2xl font-black text-gray-800 mb-1">Login</h1>
            <p className="text-gray-400 text-sm mb-7">Enter your credentials to continue</p>

            {error && (
                <div className="flex items-start gap-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                  <span className="mt-0.5 text-lg">!</span>
                  <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  
                  <input
                    id="login-password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 btn-glow disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>Login to Dashboard →</>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
              <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-700">
                <p className="font-semibold mb-1">Test Credentials</p>
                <p>Create an account using Sign Up to get started!</p>
              </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:text-purple-600 transition-colors">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
