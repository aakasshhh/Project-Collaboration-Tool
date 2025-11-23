import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const { signup } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      await signup(form);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0C15] p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-center text-indigo-300 mb-6">
          Create your account
        </h2>

        <form onSubmit={submit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              required
              className="w-full p-3 bg-[#1B1925] border border-[#2A2A40] rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email address</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
              className="w-full p-3 bg-[#1B1925] border border-[#2A2A40] rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full p-3 bg-[#1B1925] border border-[#2A2A40] rounded-xl text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-indigo-400 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-3 bg-[#1B1925] border border-[#2A2A40] rounded-xl text-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none"
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
