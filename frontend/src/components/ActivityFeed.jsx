import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ActivityFeed({ projectId, team }) {
  const [acts, setActs] = useState([]);

  useEffect(() => {
    fetch();
  }, [projectId, team]);

  async function fetch() {
    try {
      const res = await api.get('/activity', { params: projectId ? { projectId } : {} });
      setActs(res.data.slice(0, 10));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card">
      <h4 className="font-semibold mb-2 bg-red-500">Activity</h4>
      <ul className="space-y-2 text-sm">
        {acts.map(a => (
          <li key={a._id} className="border-b pb-2">
            <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
            <div>{a.message}</div>
            <div className="text-xs text-gray-400">{a.user?.name}</div>
          </li>
        ))}
        {acts.length === 0 && <li className="text-xs text-gray-400">No recent activity</li>}
      </ul>
    </div>
  );
}
