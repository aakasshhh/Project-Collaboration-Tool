import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, Activity } from "lucide-react";

export default function ActivityFeed({ projectId, team }) {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, team]);

  async function fetchActivity() {
    try {
      setLoading(true);
      const params = {};
      if (projectId) params.projectId = projectId;
      if (team?._id) params.teamId = team._id;

      const res = await api.get("/activity", { params });
      setActs(res.data.slice(0, 10)); // latest 10
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg ">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h4 className="text-lg font-semibold text-indigo-300">Recent Activity</h4>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400 animate-pulse">Loading activity...</div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {acts.length > 0 ? (
              acts.map((a) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative pl-5 border-l border-white/10"
                >
                  <span className="absolute -left-[7px] top-1 w-3 h-3 bg-indigo-500 rounded-full shadow-md" />
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-100">{a.message}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {a.user?.name || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(a.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-400 text-center mt-6"
              >
                No recent activity
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
