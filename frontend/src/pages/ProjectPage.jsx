import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import TaskCard from "../components/TaskCard";
import ActivityFeed from "../components/ActivityFeed";
import { AuthContext } from "../contexts/AuthContext";
import { io } from "socket.io-client";
import { Loader2, Plus } from "lucide-react";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // ─── Setup socket + fetch ─────────────────────────────────────
  useEffect(() => {
    fetchTasks();

    const s = io(import.meta.env.VITE_API_URL || "http://localhost:8000", {
      auth: {
        userId:
          user?.id ||
          user?._id ||
          (localStorage.getItem("pc_user") &&
            JSON.parse(localStorage.getItem("pc_user")).id),
      },
    });

    setSocket(s);
    s.on("task:assigned", fetchTasks);
    s.on("task:status_changed", fetchTasks);

    return () => s.disconnect();
  }, [projectId]);

  // ─── Fetch Tasks ─────────────────────────────────────────────
  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ─── Create Task ─────────────────────────────────────────────
  async function createTask(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Enter a title.");
    try {
      setCreating(true);
      await api.post("/tasks", {
        title,
        description: desc,
        projectId,
        assignedUsers: [],
        dueDate,
      });
      setTitle("");
      setDesc("");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  // ─── UI ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0D0C15] text-gray-200 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT SIDE - TASKS */}
        <div className="col-span-8">
          <div className="bg-[#13111C] border border-[#2A2A40] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <h2 className="text-xl font-semibold text-indigo-400 mb-6">
              Tasks
            </h2>

            {/* Form */}
            <form
              onSubmit={createTask}
              className="grid grid-cols-3 gap-3 mb-6 items-end"
            >
              <div className="col-span-1">
                <label className="text-sm text-gray-400">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full p-2 bg-[#1B1925] border border-[#2A2A40] rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="text-sm text-gray-400">Description</label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short description"
                  className="w-full p-2 bg-[#1B1925] border border-[#2A2A40] rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  type="date"
                  className="p-2 bg-[#1B1925] border border-[#2A2A40] rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none"
                />
                <button
                  disabled={creating}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create
                </button>
              </div>
            </form>

            {/* Task List */}
            {loading ? (
              <div className="flex justify-center py-10 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((t) => (
                  <TaskCard key={t._id} task={t} refresh={fetchTasks} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-6">
                No tasks yet
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - ACTIVITY FEED */}
        <div className="col-span-4">
          <div className="bg-[#13111C] border border-[#2A2A40] rounded-2xl shadow-md p-5">
            <ActivityFeed projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}
