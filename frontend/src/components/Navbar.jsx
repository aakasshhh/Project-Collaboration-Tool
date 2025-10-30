import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-indigo-600">ProjectCollab</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <Link to="/" className="text-sm px-3 py-1 rounded-md hover:bg-gray-100">Dashboard</Link>
              <button onClick={logout} className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1 rounded-md hover:bg-gray-100">Login</Link>
              <Link to="/signup" className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
