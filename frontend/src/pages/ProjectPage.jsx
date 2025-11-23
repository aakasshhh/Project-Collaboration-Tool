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

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-gray-900 to-slate-900 text-gray-100 p-6">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Tasks Section */}
        <div className="md:col-span-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10">

            <h2 className="text-xl font-semibold text-indigo-300 mb-6">
              Tasks
            </h2>

            {/* Create Task Form */}
            <form
              onSubmit={createTask}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
            >
              <div>
                <label className="text-sm text-gray-300">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Description</label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short description"
                  className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 items-end">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-gray-100 focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  disabled={creating}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
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
              <div className="flex justify-center py-10 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((t) => (
                  <TaskCard key={t._id} task={t} refresh={fetchTasks} />
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center py-6">
                No tasks yet
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/10">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              Activity
            </h2>
            <ActivityFeed projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}
