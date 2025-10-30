import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import ActivityFeed from '../components/ActivityFeed';
import { AuthContext } from '../contexts/AuthContext';
import { io } from 'socket.io-client';

export default function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchProject();
    fetchTasks();
    // socket connect
    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:8000', {
      auth: { userId: user?.id || user?._id || localStorage.getItem('pc_user') && JSON.parse(localStorage.getItem('pc_user')).id }
    });
    setSocket(s);
    s.on('task:assigned', (payload) => {
      // handle notifications, refresh
      fetchTasks();
      console.log('socket assigned', payload);
    });
    s.on('task:status_changed', (payload) => fetchTasks());
    return ()=> s.disconnect();
    // eslint-disable-next-line
  }, [projectId]);

  async function fetchProject(){
    try {
      // backend does not have project GET by id; we will rely on projects list on dashboard
      const res = await api.get(`/projects/team/${projectId}`); // incorrect, can't fetch by projectId
      // Safe approach: fetch project list for all teams and find id --- but backend lacks GET /projects/:id
      // For now keep minimal: user sees tasks for the project.
    } catch (err) {
      // ignore
    }
  }

  async function fetchTasks(){
    try {
      const res = await api.get(`/tasks/project/${projectId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function createTask(e) {
    e.preventDefault();
    try {
      await api.post('/tasks', { title, description: desc, projectId, assignedUsers: [], dueDate });
      setTitle(''); setDesc(''); setDueDate('');
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <div className="card mb-4">
          <h3 className="text-lg font-semibold mb-3">Tasks</h3>
          <form onSubmit={createTask} className="space-y-2 mb-4">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="w-full p-2 border rounded" />
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" className="w-full p-2 border rounded" />
            <div className="flex gap-2">
              <input value={dueDate} onChange={e=>setDueDate(e.target.value)} type="date" className="p-2 border rounded" />
              <button className="bg-green-600 text-white px-3 rounded">Create task</button>
            </div>
          </form>

          <div className="space-y-3">
            {tasks.map(t => <TaskCard key={t._id} task={t} refresh={fetchTasks} socket={socket} />)}
            {tasks.length === 0 && <div className="text-sm text-gray-500">No tasks yet</div>}
          </div>
        </div>
      </div>

      <div className="col-span-4">
        <ActivityFeed projectId={projectId} />
      </div>
    </div>
  );
}
