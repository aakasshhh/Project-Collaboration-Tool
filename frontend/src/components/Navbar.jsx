import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50 
        bg-black/20 backdrop-blur-xl
        border-b border-indigo-900/40
        px-6 py-3
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div
          className="text-2xl font-semibold text-indigo-300 cursor-pointer hover:text-indigo-200 transition"
          onClick={() => navigate("/")}
        >
          Collabify
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">

          {/* When User Is NOT Logged In */}
          {!user && (
            <>
              <Link
                to="/login"
                className="
                  text-indigo-200 px-4 py-2 rounded-lg
                  hover:bg-indigo-900/30 transition
                "
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="
                  px-4 py-2 rounded-lg 
                  bg-indigo-600/90 hover:bg-indigo-500 
                  text-white transition shadow-md shadow-indigo-600/20
                "
              >
                Sign Up
              </Link>
            </>
          )}

          {/* When User IS Logged In */}
          {user && (
            <>
              <div className="text-indigo-200 text-sm opacity-90">
                {user.name}
              </div>

              <button
                onClick={logout}
                className="
                  px-4 py-2 rounded-lg 
                  border border-indigo-800/40 
                  bg-indigo-950/20 hover:bg-indigo-900/30 
                  text-indigo-200 transition
                "
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
