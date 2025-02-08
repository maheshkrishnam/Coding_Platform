import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-h-full bg-slate-900 text-white text-center py-40">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Oops! Page Not Found</h2>
      <p className="text-gray-400 mt-3 max-w-md">
        The page you are looking for doesn’t exist or has been moved. Let’s get you back on track!
      </p>
      <Link
        to="/problems"
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-200"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
