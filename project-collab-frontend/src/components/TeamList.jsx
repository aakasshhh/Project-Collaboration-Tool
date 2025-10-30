import React, { useContext, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function TeamList({ teams, onSelect, selected, refresh }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');

  async function createTeam(e) {
    e.preventDefault();
    try {
      await api.post('/teams', { name });
      setName('');
      refresh && refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create team');
    }
  }

  return (
    <div className="card">
      <h4 className="font-semibold mb-3">Teams</h4>
      <div className="space-y-2">
        {teams.map(t => (
          <div key={t._id} className={`p-2 rounded cursor-pointer ${selected?._id === t._id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`} onClick={()=>onSelect(t)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.members?.length || 0} members</div>
              </div>
              <Link to={`/teams/${t._id}`} className="text-xs text-indigo-600">Open</Link>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={createTeam} className="mt-4">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="New team name" className="w-full p-2 border rounded mb-2" />
        <button className="w-full bg-indigo-600 text-white py-1 rounded">Create team</button>
      </form>
    </div>
  );
}
