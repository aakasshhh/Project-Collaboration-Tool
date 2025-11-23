import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { User, Mail, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center py-12 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-indigo-100 rounded-2xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent mb-8">
          Your Profile
        </h2>

        <div className="space-y-6">

          {/* NAME */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
            <User className="text-indigo-600" size={22} />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
            <Mail className="text-indigo-600" size={22} />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
          </div>

          {/* ROLE */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
            <Shield className="text-indigo-600" size={22} />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-semibold text-gray-800 capitalize">
                {user.role}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
