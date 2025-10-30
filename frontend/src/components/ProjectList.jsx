import React, { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function ProjectList({ projects, team, refresh }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  async function createProject(e) {
    e.preventDefault();
    if (!team) return alert('Select a team');
    try {
      await api.post('/projects', { name, description: desc, teamId: team._id });
      setName(''); setDesc('');
      refresh && refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  }

  return (
    <div>
      <div className="mb-4">
        <form onSubmit={createProject} className="grid grid-cols-3 gap-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Project name" className="col-span-1 p-2 border rounded" />
          <input value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Short description" className="col-span-1 p-2 border rounded" />
          <button className="col-span-1 bg-green-600 text-white rounded">New project</button>
        </form>
      </div>

      <div className="space-y-3">
        {projects.map(p => (
          <div key={p._id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">{p.description}</div>
            </div>
            <Link to={`/projects/${p._id}`} className="text-sm text-indigo-600">Open</Link>
          </div>
        ))}
        {projects.length === 0 && <div className="text-sm text-gray-500">No projects yet</div>}
      </div>
    </div>
  );
}
