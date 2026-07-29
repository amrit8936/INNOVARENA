import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "participant", college: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signup", form);
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // Role descriptions shown when a role is selected
    const roleInfo = {
      participant: { desc: "Join hackathons, create teams, and submit projects." },
      organizer:   { desc: "Create and manage hackathons, review registrations." },
      judge:       { desc: "Evaluate submissions and score projects by criteria." },
    };

  const selectedRole = roleInfo[form.role] || roleInfo.participant;

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 hero-gradient text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Join INNOVARENA</h2>
          <p className="text-indigo-100 mb-8 max-w-sm">Start competing, organizing, or judging hackathons in minutes.</p>

          {/* Role preview */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-5 border border-white border-opacity-20">
            <p className="font-bold capitalize mb-1">{form.role}</p>
            <p className="text-indigo-100 text-sm">{selectedRole.desc}</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md fade-in-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-2xl font-black">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">INNOVARENA</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h1 className="text-2xl font-black text-gray-800 mb-1">Create Account</h1>
            <p className="text-gray-400 text-sm mb-6">Fill in your details to get started</p>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                  <span>!</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    id="signup-name"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    id="signup-email"
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
                    id="signup-password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-12"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Password strength bar */}
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${form.password.length >= level * 3 ? (level === 1 ? "bg-red-400" : level === 2 ? "bg-yellow-400" : "bg-green-400") : "bg-gray-200"}`}></div>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      {form.password.length < 4 ? "Weak" : form.password.length < 7 ? "Medium" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">College Name</label>
                <div className="relative">
                  <input
                    id="signup-college"
                    name="college"
                    placeholder="Your college (optional)"
                    value={form.college}
                    onChange={handleChange}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Role selector – cards */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(roleInfo).map(([role, info]) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm({ ...form, role })}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                        form.role === role
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 hover:border-indigo-200 text-gray-600"
                      }`}
                    >
                      <span className="text-xs font-semibold capitalize">{role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 btn-glow disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                    <>Create Account — It's Free!</>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-purple-600 transition-colors">
                Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
