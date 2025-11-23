import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Loader2 } from "lucide-react";

export default function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [identifiers, setIdentifiers] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  async function fetchTeam() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/teams/mine");
      const found = res.data.find((t) => t._id === teamId);
      setTeam(found || null);
    } catch (err) {
      setError("Failed to fetch team. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function addMember(e) {
    e.preventDefault();
    if (!identifiers.trim()) return;

    const list = identifiers
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!list.length) {
      setMessage("Enter at least one valid email or username.");
      return;
    }

    setAdding(true);
    setMessage("");
    try {
      const res = await api.post(`/teams/${teamId}/members`, { identifiers: list });
      setMessage(res.data.message || "Members added successfully.");
      setIdentifiers("");
      fetchTeam();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add member.");
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading team...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!team) {
    return <div className="text-center text-gray-400 mt-10">Team not found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl shadow-xl text-gray-100">

      {/* Team Header */}
      <h2 className="text-2xl font-bold text-indigo-300 mb-4">
        {team.name}
      </h2>

      {/* Members List */}
      <div className="mb-8">
        <h3 className="font-semibold text-indigo-200 mb-2">Members</h3>

        {team.members.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {team.members.map((m) => (
              <li
                key={m._id}
                className="py-2 flex justify-between text-sm"
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-gray-300">{m.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">No members yet.</p>
        )}
      </div>

      {/* Add Member */}
      <form onSubmit={addMember} className="space-y-3">
        <input
          type="text"
          placeholder="Emails or usernames, comma-separated"
          value={identifiers}
          onChange={(e) => setIdentifiers(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={adding}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 rounded-lg transition"
        >
          {adding ? "Adding..." : "Add Member"}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-sm text-center py-2 rounded-md bg-white/10 border border-white/20">
          {message}
        </div>
      )}
    </div>
  );
}
