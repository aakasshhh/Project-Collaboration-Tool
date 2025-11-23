import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ToggleLeft, ToggleRight, Bell, Moon, Sun } from "lucide-react";

export default function Settings() {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent mb-8">
          Settings
        </h2>

        {/* ACCOUNT SECTION */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account</h3>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition">
              <p className="text-gray-500 text-sm">Logged in as</p>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Preferences
          </h3>

          {/* NOTIFICATION TOGGLE */}
          <div
            className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => setNotifications(!notifications)}
          >
            <div className="flex items-center gap-3">
              <Bell className="text-indigo-600" size={22} />
              <span className="font-medium text-gray-800">Notifications</span>
            </div>
            {notifications ? (
              <ToggleRight className="text-indigo-600" size={28} />
            ) : (
              <ToggleLeft className="text-gray-400" size={28} />
            )}
          </div>

          {/* DARK MODE TOGGLE */}
          <div
            className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer mt-4"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="text-indigo-600" size={22} />
              ) : (
                <Sun className="text-indigo-600" size={22} />
              )}
              <span className="font-medium text-gray-800">Dark Mode</span>
            </div>
            {darkMode ? (
              <ToggleRight className="text-indigo-600" size={28} />
            ) : (
              <ToggleLeft className="text-gray-400" size={28} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
