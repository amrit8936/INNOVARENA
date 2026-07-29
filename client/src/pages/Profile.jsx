import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import Loader from "../components/Loader.jsx";

// Profile page – view and edit your own profile
const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", college: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load current profile from backend
  useEffect(() => {
    api.get("/auth/profile")
      .then(({ data }) => {
        setForm({ name: data.name, college: data.college || "" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const { data } = await api.put("/auth/profile", form);
      // Update name in AuthContext so navbar shows new name
      login({ ...user, name: data.name }, localStorage.getItem("token"));
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Update failed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-lg mx-auto px-4 py-10 fade-in">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        {/* Avatar */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl text-white font-bold mx-auto">
            {form.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mt-3 text-gray-800">{form.name}</h2>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
            {user?.role}
          </span>
        </div>

        {/* Message */}
        {message && (
          <div className={`rounded-lg px-4 py-2 mb-4 text-sm ${message.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Read-only fields */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Email (cannot be changed)</label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
            {user?.email}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-1">Role (cannot be changed)</label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 capitalize">
            {user?.role}
          </div>
        </div>

        {/* Editable form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="profile-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
            <input
              id="profile-college"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="Your college name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            id="profile-save"
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
