import React, { useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  UserPlus,
  CheckCircle2,
  Clock,
  ListTodo,
  Loader2,
  Calendar,
  Edit,
  X,
} from "lucide-react";

export default function TaskCard({ task, refresh }) {
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  });

  async function updateStatus(e) {
    const newStatus = e.target.value;

    try {
      setLoading(true);
      await api.patch(`/tasks/${task._id}`, { status: newStatus });
      setStatus(newStatus);
      refresh && refresh();
    } catch {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  async function assignUser() {
    const input = prompt("Enter email(s) or username(s), comma-separated:");
    if (!input) return;

    const identifiers = input.split(",").map(x => x.trim()).filter(Boolean);

    try {
      setLoading(true);
      const res = await api.post(`/tasks/${task._id}/assign`, { identifiers });
      const assignedNames =
        res.data.assignedUsers.map(u => u.name).join(", ") || "user(s)";
      alert(`Task assigned to ${assignedNames} successfully!`);
      refresh && refresh();
    } catch {
      alert("Failed to assign user(s)");
    } finally {
      setLoading(false);
    }
  }

  async function saveEdits(e) {
    e.preventDefault();

    try {
      setLoading(true);
      await api.patch(`/tasks/${task._id}`, editData);
      alert("Task updated successfully!");
      setIsEditing(false);
      refresh && refresh();
    } catch {
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  }

  const statusStyles = {
    todo: "bg-gray-800/40 text-gray-300 border border-gray-700",
    in_progress: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
    completed: "bg-green-500/20 text-green-300 border border-green-500/40",
  };

  const statusLabel = {
    todo: "To Do",
    in_progress: "In Progress",
    completed: "Completed",
  };

  const statusIcon = {
    todo: <ListTodo className="w-4 h-4" />,
    in_progress: <Loader2 className="w-4 h-4 animate-spin-slow" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
  };

  return (
    <>
      {/* MAIN CARD */}
      <motion.div
        layout
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 140 }}
        className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-start shadow-lg hover:border-indigo-500/40 transition-all duration-200"
      >
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-2 w-2/3">
          <h4 className="font-semibold text-indigo-300 text-lg">
            {task.title}
          </h4>

          <p className="text-sm text-gray-300">
            {task.description || "No description added"}
          </p>

          <div className="flex flex-col gap-1 text-xs mt-2 text-gray-400">
            <span className="flex items-center gap-2">
              <UserPlus className="w-3 h-3 text-indigo-300" />
              Assigned:
              <span className="text-gray-200">
                {task.assignedUsers?.map(u => u.name).join(", ") || "—"}
              </span>
            </span>

            <span className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-indigo-300" />
              Due:
              <span className="text-gray-200">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "—"}
              </span>
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end gap-3">

          {/* STATUS LABEL */}
          <div
            className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full font-medium shadow-md ${statusStyles[status]}`}
          >
            {statusIcon[status]}
            {statusLabel[status]}
          </div>

          {/* STATUS DROPDOWN */}
          <select
            value={status}
            onChange={updateStatus}
            disabled={loading}
            className="bg-white/5 border border-white/10 text-gray-200 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={assignUser}
              disabled={loading}
              className="text-sm px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition flex items-center gap-1 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" /> Assign
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="text-sm px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition flex items-center gap-1"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </motion.div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.form
            onSubmit={saveEdits}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[90%] max-w-md shadow-xl text-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-300">
                Edit Task
              </h2>
              <X
                onClick={() => setIsEditing(false)}
                className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer"
              />
            </div>

            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={e =>
                setEditData(prev => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 rounded bg-black/30 border border-white/10 mb-3 text-gray-100"
              required
            />

            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={editData.description}
              onChange={e =>
                setEditData(prev => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-2 rounded bg-black/30 border border-white/10 mb-3 text-gray-100"
            />

            <label className="block text-sm mb-1">Due Date</label>
            <input
              type="date"
              value={editData.dueDate}
              onChange={e =>
                setEditData(prev => ({ ...prev, dueDate: e.target.value }))
              }
              className="w-full p-2 rounded bg-black/30 border border-white/10 mb-4 text-gray-100"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </>
  );
}
