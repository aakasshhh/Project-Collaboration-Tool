import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/axios";
import { Users, PlusCircle, ArrowRight } from "lucide-react";

export default function TeamList({ teams, onSelect, selected, refresh }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function createTeam(e) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await api.post("/teams", { name });
      setName("");
      refresh && refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
          <Users className="w-5 h-5" /> Teams
        </h4>
        <span className="text-xs text-gray-400">{teams.length} total</span>
      </div>

      {/* Team List */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {teams.map((t) => (
            <motion.div
              key={t._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl cursor-pointer transition border flex items-center justify-between ${
                selected?._id === t._id
                  ? "bg-indigo-600/30 border-indigo-400 text-white shadow-inner"
                  : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-200"
              }`}
              onClick={() => onSelect(t)}
            >
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-gray-400">
                  {t.members?.length || 0} member
                  {t.members?.length === 1 ? "" : "s"}
                </div>
              </div>

              <Link
                to={`/teams/${t._id}`}
                className="flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-400 transition"
                onClick={(e) => e.stopPropagation()}
              >
                Open <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Team Form */}
      <form onSubmit={createTeam} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New team name"
          className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl transition disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}
