import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
      <h1 className="font-bold text-xl">FxWealth</h1>
      <div>
        {role && <span className="mr-4 capitalize">{role} dashboard</span>}
        <button className="bg-red-500 px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
