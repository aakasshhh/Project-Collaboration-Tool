import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-gray-900 to-black text-gray-100 flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
        Build and manage your projects smarter
      </h1>

      <p className="text-center text-gray-300 max-w-xl mb-8">
        A simple workspace where teams collaborate, track tasks and stay productive.
      </p>

      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="border border-gray-500 hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
