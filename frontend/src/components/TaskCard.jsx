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
  })
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

    const identifiers = input.split(",").map((x) => x.trim()).filter(Boolean);

    try {
      setLoading(true);
      const res = await api.post(`/tasks/${task._id}/assign`, { identifiers });
      const assignedNames =
        res.data.assignedUsers.map((u) => u.name).join(", ") || "user(s)";
      alert(`Task assigned to ${assignedNames} successfully!`);
      refresh && refresh();
    } catch {
      alert("Failed to assign user(s)");
    } finally {
      setLoading(false);
    }
  }

  async function saveEdits(e){
    e.preventDefault();
    try{
      setLoading(true);
      await api.patch(`/tasks/${task._id}`, editData);
      alert("Task updated successfully!");
      setIsEditing(false);
      refresh && refresh();
    } catch{
      alert("Failed to update task");
    }finally{
      setLoading(false);
    }
  }
  const statusStyles = {
    todo: "bg-slate-700/40 text-slate-300 border border-slate-600",
    in_progress: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    completed: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
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
      {/* Main Card */}
      <motion.div
        layout
        whileHover={{ scale: 1.02, backgroundColor: "#1c1b29" }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-[#13111C] border border-[#2A2A40] rounded-2xl p-5 flex justify-between items-start shadow-md hover:shadow-lg hover:border-indigo-700/60 transition-all duration-200"
      >
        {/* Left Content */}
        <div className="flex flex-col space-y-2 text-gray-200 w-2/3">
          <h4 className="font-semibold text-indigo-400 text-lg tracking-wide">
            {task.title}
          </h4>
          <p className="text-sm text-gray-400 leading-snug">
            {task.description || "No description provided"}
          </p>

          <div className="flex flex-col gap-1 text-xs text-gray-400 mt-2">
            <span className="flex items-center gap-2 ">
              <UserPlus className="w-3 h-3 text-indigo-400 hover:cursor-pointer" />
              Assigned:{" "}
              <span className="text-gray-300">
                {task.assignedUsers?.map((u) => u.name).join(", ") || "—"}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-indigo-400" />
              Due:{" "}
              <span className="text-gray-300">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "—"}
              </span>
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-col items-end gap-3">
          <div
            className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full font-medium ${statusStyles[status]} shadow-sm`}
          >
            {statusIcon[status]}
            {statusLabel[status]}
          </div>

          <select
            value={status}
            onChange={updateStatus}
            disabled={loading}
            className="bg-[#1D1B28] border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={assignUser}
              disabled={loading}
              className="text-sm px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all duration-150 flex items-center gap-1 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              Assign
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="text-sm px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-all duration-150 flex items-center gap-1"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.form
            onSubmit={saveEdits}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1D1B28] border border-indigo-700/50 rounded-2xl p-6 w-[90%] max-w-md shadow-lg text-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-400">
                Edit Task
              </h2>
              <X
                onClick={() => setIsEditing(false)}
                className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer"
              />
            </div>

            <label className="block text-sm mb-2">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 rounded bg-[#13111C] border border-gray-700 mb-3 text-gray-200"
              required
            />

            <label className="block text-sm mb-2">Description</label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full p-2 rounded bg-[#13111C] border border-gray-700 mb-3 text-gray-200"
            />

            <label className="block text-sm mb-2">Due Date</label>
            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="w-full p-2 rounded bg-[#13111C] border border-gray-700 mb-4 text-gray-200"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all disabled:opacity-50"
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
