import { Link } from "react-router-dom";

// NotFound – 404 error page shown for any unknown URL
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center px-4 text-center fade-in">
      {/* Big 404 */}
      <div className="text-[120px] font-extrabold text-indigo-100 leading-none select-none">
        404
      </div>

      <div className="-mt-4 mb-6">
        <div className="text-5xl mb-4">🚀</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 max-w-sm">
          Oops! Looks like this page doesn't exist. Maybe you took a wrong turn in the hackathon!
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-md"
        >
          Go Home
        </Link>
        <Link
          to="/hackathons"
          className="bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Explore Hackathons
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
