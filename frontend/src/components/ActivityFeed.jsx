import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Activity } from "lucide-react";

export default function ActivityFeed({ projectId, team }) {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [projectId, team]);

  async function fetchActivity() {
    try {
      const params = projectId ? { projectId } : {};
      const res = await api.get("/activity", { params });
      setActs(res.data.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-indigo-300" />
        <h4 className="text-lg font-semibold text-indigo-300">Activity</h4>
      </div>

      {/* Activity List */}
      <div className="space-y-3 text-sm">
        <AnimatePresence>
          {acts.map((a) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-b border-white/10 pb-2"
            >
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(a.createdAt).toLocaleString()}
              </div>

              <div className="text-gray-100 mt-1">{a.message}</div>

              <div className="text-xs text-indigo-300 mt-1">
                {a.user?.name || "Unknown user"}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && acts.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-3">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
