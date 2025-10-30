import React, { useState } from 'react';
import api from '../api/axios';

export default function TaskCard({ task, refresh }) {
  const [status, setStatus] = useState(task.status);

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
    const input = prompt('Enter email(s) or username(s), comma-separated:');
    if (!input) return;

    const identifiers = input.split(',').map((x) => x.trim()).filter(Boolean);

    try {
      const res = await api.post(`/tasks/${task._id}/assign`, { identifiers });
      const assignedNames = res.data.assignedUsers
        .map((u) => u.name)
        .join(', ') || 'user(s)';

      alert(`Task assigned to ${assignedNames} successfully!`);
      refresh && refresh();
    } catch (err) {
      alert('Failed to assign user(s)');
    }
  }

  return (
    <div className="p-3 border rounded flex items-start justify-between bg-white shadow-sm hover:shadow-md transition">
      <div>
        <div className="font-medium text-gray-800">{task.title}</div>
        <div className="text-sm text-gray-500">{task.description}</div>
        <div className="text-xs mt-2">
          Assigned: {task.assignedUsers?.map((u) => u.name).join(', ') || '—'}
        </div>
        <div className="text-xs text-gray-400">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <select
          value={status}
          onChange={updateStatus}
          className="p-1 border rounded text-sm"
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={assignUser}
          className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Assign
        </button>
      </div>
    </div>
  );
}
