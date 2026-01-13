import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const Navigation = () => {
  const {logout}=useAuth()
  const location=useLocation()

  const navItems=[
    {name:'Logs',path:'/dashboard',icon:'📋'},
    {name:'Profile',path:'/dashboard/profile',icon:'👤'}
  ]

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on md screens and up) */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col p-6 fixed h-full">
        <h1 className="text-2xl font-black mb-10 tracking-tighter italic">w<span className="text-blue-500">Tracker</span></h1>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-bold">{item.name}</span>
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="text-left p-3 text-red-400 font-bold hover:bg-red-500/10 rounded-xl">
          Logout
        </button>
      </aside>

      {/* MOBILE BOTTOM NAV (Visible on small screens only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
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