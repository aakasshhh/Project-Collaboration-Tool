import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required className="w-full mt-1 p-2 border rounded" />
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Sign in</button>
      </form>
      <p className="text-sm mt-3">Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link></p>
    </div>
  );
}
