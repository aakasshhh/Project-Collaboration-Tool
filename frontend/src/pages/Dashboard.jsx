import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import TeamList from "../components/TeamList";
import ProjectList from "../components/ProjectList";
import ActivityFeed from "../components/ActivityFeed";
import { AuthContext } from "../contexts/AuthContext";
import {  Settings } from "lucide-react";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) fetchProjects(selectedTeam._id);
    else setProjects([]);
  }, [selectedTeam]);

  async function fetchTeams() {
    try {
      const res = await api.get("/teams/mine");
      setTeams(res.data);
      if (res.data.length) setSelectedTeam(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProjects(teamId) {
    try {
      const res = await api.get(`/projects/team/${teamId}`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-gray-900 to-slate-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-indigo-300">
            Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your teams, projects, and activity — all in one place.
          </p>
        </div>
     
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10 h-full">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300 flex items-center justify-between">
              Teams
            </h2>
            <TeamList
              teams={teams}
              onSelect={setSelectedTeam}
              selected={selectedTeam}
              refresh={fetchTeams}
            />
          </div>
        </div>

        {/* Projects Section */}
        <div className="md:col-span-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/10 h-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-indigo-300">
                {selectedTeam ? selectedTeam.name : "Select a Team"}
              </h3>
              {selectedTeam && (
                <Link
                  to={`/teams/${selectedTeam._id}`}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Settings className="w-4 h-4" /> Manage
                </Link>
              )}
            </div>

            <ProjectList
              projects={projects}
              team={selectedTeam}
              refresh={() =>
                selectedTeam && fetchProjects(selectedTeam._id)
              }
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/10 h-full">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              Activity
            </h2>
            <ActivityFeed team={selectedTeam} />
          </div>
        </div>
      </div>
    </div>
  );
}
