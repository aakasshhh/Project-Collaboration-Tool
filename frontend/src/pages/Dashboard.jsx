import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import TeamList from '../components/TeamList';
import ProjectList from '../components/ProjectList';
import ActivityFeed from '../components/ActivityFeed';
import { AuthContext } from '../contexts/AuthContext';

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
      const res = await api.get('/teams/mine');
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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <TeamList teams={teams} onSelect={setSelectedTeam} selected={selectedTeam} refresh={fetchTeams}/>
      </div>

      <div className="col-span-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{selectedTeam ? selectedTeam.name : 'No team selected'}</h3>
            {selectedTeam && <Link to={`/teams/${selectedTeam._id}`} className="text-sm text-indigo-600">Manage</Link>}
          </div>
          <ProjectList projects={projects} team={selectedTeam} refresh={() => selectedTeam && fetchProjects(selectedTeam._id)} />
        </div>
      </div>

      <div className="col-span-3">
        <ActivityFeed team={selectedTeam} />
      </div>
    </div>
  );
}
