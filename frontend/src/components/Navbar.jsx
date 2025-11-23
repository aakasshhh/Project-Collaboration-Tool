import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-gray-800";

  return (
    <nav className="backdrop-blur-lg bg-white/60 border-b border-white/20 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight"
        >
          Collabify
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Greeting */}
              <div className="hidden md:flex items-center gap-2 text-gray-700">
                <User size={18} className="text-indigo-600" />
                <span className="font-medium">
                  {user.name.split(" ")[0]}
                </span>
              </div>

              {/* Dashboard */}
              <Link
                to="/"
                className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md transition ${isActive("/")}`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className={`text-sm px-3 py-1.5 rounded-md transition ${isActive("/login")}`}
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className="text-sm px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
