import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(()=> {
    fetchTeam();
  }, [teamId]);

  async function fetchTeam(){
    try {
      const res = await api.get('/teams/mine');
      const found = res.data.find(t => t._id === teamId);
      setTeam(found);
    } catch (err) {
      console.error(err);
    }
  }

  async function addMember(e) {
    e.preventDefault();
    try {
      // backend expects userId — we only have email; ideally backend route accepts email or frontend resolves user id elsewhere.
      // For quick flow, assume we have an endpoint to invite by email — but backend currently expects userId.
      // So UI will call an API you'll add later or backend admin can add. For now show the call:
      const userId = prompt('Paste userId to add (or implement lookup in backend to accept email)');
      if (!userId) return;
      await api.post(`/teams/${teamId}/members`, { userId });
      alert('Added');
      fetchTeam();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  }

  if (!team) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
      <div className="mb-4">
        <h4 className="font-medium">Members</h4>
        <ul className="mt-2">
          {team.members.map(m => <li key={m._id} className="text-sm">{m.name} — <span className="text-xs text-gray-500">{m.email}</span></li>)}
        </ul>
      </div>
      <form onSubmit={addMember}>
        <button className="bg-indigo-600 text-white py-1 px-3 rounded">Add member (userId)</button>
      </form>
    </div>
  );
}
