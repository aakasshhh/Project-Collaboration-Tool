import React, { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Folder, ChevronRight } from "lucide-react";

export default function ProjectList({ projects, team, refresh }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function createProject(e) {
    e.preventDefault();
    if (!team) return alert("Select a team first");

    try {
      setLoading(true);
      await api.post("/projects", {
        name,
        description: desc,
        teamId: team._id,
      });

      setName("");
      setDesc("");
      refresh && refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Projects
        </h4>
        <span className="text-xs text-gray-400">{projects.length} total</span>
      </div>

      {/* Create Project */}
      <form
        onSubmit={createProject}
        className="space-y-3 bg-white/5 border border-white/10 p-4 rounded-xl mb-7"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Short description"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <FolderPlus className="w-4 h-4" />
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>

      {/* Project List */}
      <div className="space-y-3">
        <AnimatePresence>
          {projects.map((p) => (
            <motion.div
              key={p._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition"
            >
              <div>
                <div className="font-semibold text-gray-100">{p.name}</div>
                <div className="text-sm text-gray-400">{p.description}</div>
              </div>

              <Link
                to={`/projects/${p._id}`}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Open <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400 text-center py-4"
          >
            No projects yet — create one above
          </motion.div>
        )}
      </div>
    </div>
  );
}
