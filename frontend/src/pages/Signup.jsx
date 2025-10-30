import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });

  async function submit(e) {
    e.preventDefault();
    try {
      await signup(form);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Full name" required className="w-full p-2 border rounded" />
        <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} placeholder="Email" required className="w-full p-2 border rounded" />
        <input value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} type="password" placeholder="Password" required className="w-full p-2 border rounded" />
        <select value={form.role} onChange={(e)=>setForm({...form, role: e.target.value})} className="w-full p-2 border rounded">
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Create account</button>
      </form>
    </div>
  );
}
