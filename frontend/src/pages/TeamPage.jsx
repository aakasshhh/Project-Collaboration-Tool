import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

export default function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [identifiers, setIdentifiers] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  async function fetchTeam() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/teams/mine');
      const found = res.data.find(t => t._id === teamId);
      setTeam(found || null);
    } catch (err) {
      setError('Failed to fetch team. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function addMember(e) {
    e.preventDefault();
    if (!identifiers.trim()) return;

    const list = identifiers
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);

    if (!list.length) {
      setMessage('Please enter at least one valid email or username.');
      return;
    }

    setAdding(true);
    setMessage('');
    try {
      const res = await api.post(`/teams/${teamId}/members`, { identifiers: list });
      setMessage(res.data.message || '✅ Members added successfully!');
      setIdentifiers('');
      fetchTeam();
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Failed to add member');
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading team details...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (!team) {
    return <div className="text-center text-gray-600 mt-10">Team not found.</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">{team.name}</h2>

      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Members</h3>
        {team.members.length > 0 ? (
          <ul className="space-y-1">
            {team.members.map(m => (
              <li
                key={m._id}
                className="flex justify-between border-b border-gray-100 py-1 text-sm"
              >
                <span className="font-medium">{m.name}</span>
                <span className="text-gray-500">{m.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No members yet.</p>
        )}
      </div>

      <form onSubmit={addMember} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter email(s) or username(s), comma-separated"
          value={identifiers}
          onChange={e => setIdentifiers(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={adding}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2 px-4 rounded-md transition"
        >
          {adding ? 'Adding...' : 'Add Member'}
        </button>
      </form>

      {message && (
        <div className="mt-4 text-center text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md py-2">
          {message}
        </div>
      )}
    </div>
  );
}
