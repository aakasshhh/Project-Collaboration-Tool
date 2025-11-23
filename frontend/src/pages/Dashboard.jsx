import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import TeamList from "../components/TeamList";
import ProjectList from "../components/ProjectList";
import ActivityFeed from "../components/ActivityFeed";
import { AuthContext } from "../contexts/AuthContext";
import { Settings, FolderOpen, Users, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchProjects(selectedTeam._id);
    } else {
      setProjects([]);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-slate-900 text-gray-100 p-6">

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-indigo-300">
          Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="text-gray-400 mt-1">
          Here’s an overview of everything happening in your workspace.
        </p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "Teams",
            value: teams.length,
            icon: <Users size={26} className="text-indigo-300" />,
          },
          {
            label: selectedTeam ? selectedTeam.name + " Projects" : "Projects",
            value: projects.length,
            icon: <FolderOpen size={26} className="text-indigo-300" />,
          },
          {
            label: "Activity Items",
            value: projects.length * 3 || 0, // placeholder
            icon: <ClipboardList size={26} className="text-indigo-300" />,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">{item.icon}</div>
              <div>
                <p className="text-gray-400 text-sm">{item.label}</p>
                <p className="text-2xl font-bold text-indigo-300">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Teams Sidebar */}
        <div className="md:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/10 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-indigo-300">Teams</h2>
            </div>

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
                  <Settings size={16} />
                  Manage
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
            <h2 className="text-lg font-semibold text-indigo-300 mb-4">
              Activity
            </h2>

            <ActivityFeed team={selectedTeam} />
          </div>
        </div>

      </div>
    </div>
  );
}
