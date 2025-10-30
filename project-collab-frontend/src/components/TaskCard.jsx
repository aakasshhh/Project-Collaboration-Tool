import React, { useState } from 'react';
import api from '../api/axios';

export default function TaskCard({ task, refresh }) {
  const [status, setStatus] = useState(task.status);
  const [assignInput, setAssignInput] = useState('');

  async function updateStatus(e) {
    const newStatus = e.target.value;
    try {
      await api.patch(`/tasks/${task._id}`, { status: newStatus });
      setStatus(newStatus);
      refresh && refresh();
    } catch (err) {
      alert('Failed to update status');
    }
  }

  async function assignUser() {
    try {
      const userId = prompt('Paste userId to assign (or implement a user search).');
      if (!userId) return;
      await api.post(`/tasks/${task._id}/assign`, { userIds: [userId] });
      refresh && refresh();
    } catch (err) {
      alert('Failed to assign');
    }
  }

  return (
    <div className="p-3 border rounded flex items-start justify-between">
      <div>
        <div className="font-medium">{task.title}</div>
        <div className="text-sm text-gray-500">{task.description}</div>
        <div className="text-xs mt-2">Assigned: {task.assignedUsers?.map(u=>u.name).join(', ') || '—'}</div>
        <div className="text-xs text-gray-400">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <select value={status} onChange={updateStatus} className="p-1 border rounded text-sm">
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={assignUser} className="text-sm px-2 py-1 bg-indigo-50 text-indigo-600 rounded">Assign</button>
      </div>
    </div>
  );
}
