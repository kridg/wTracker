import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Activity, User as UserIcon } from 'lucide-react'

const Navigation = () => {
  const { logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Logs', path: '/dashboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <UserIcon className="w-4 h-4" /> }
  ]

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on md screens and up) */}
      <aside className="hidden md:flex w-64 bg-white text-gray-900 flex-col p-6 fixed h-full border-r border-gray-200 shadow-sm">
        <h1 className="text-2xl font-black mb-8 tracking-tight">
          w<span className="text-red-600">Tracker</span>
        </h1>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all ${
                location.pathname === item.path
                  ? 'bg-red-600 text-white shadow-md hover:bg-red-700'
                  : 'hover:bg-gray-50 text-gray-600 hover:text-red-600'
              }`}
            >
              <span className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                location.pathname === item.path
                  ? 'bg-red-500 text-white'
                  : 'bg-red-50 text-red-600'
              }`}>
                {item.icon}
              </span>
              <span className="font-bold">{item.name}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="text-left mt-auto p-3 text-gray-700 font-bold hover:bg-gray-50 hover:text-red-600 rounded-xl text-sm transition-all"
        >
          Logout
        </button>
      </aside>

      {/* MOBILE BOTTOM NAV (Visible on small screens only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 px-6 py-2.5 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === item.path 
                ? 'text-red-600 scale-105' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <span className={`rounded-full border p-1.5 transition-all ${
              location.pathname === item.path
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              {item.name}
            </span>
          </Link>
        ))}
        {/* <button onClick={logout} className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">🚪</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Exit</span>
        </button> */}
      </nav>
    </>
  )
}

export default Navigation