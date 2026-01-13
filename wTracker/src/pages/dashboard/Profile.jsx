import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchProfileStats } from '../../api/workout'

const Profile = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({ total_workouts: 0, total_sets: 0, last_workout: null })

  useEffect(() => {
    fetchProfileStats().then(data => setStats(data))
      .catch(err => console.error("Error fetching stats", err))
  }, [])

  return (
    <div className="max-w-md mx-auto pt-10 px-4">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-xl">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">{user?.username}</h2>
        <p className="text-gray-400 font-medium">{user?.email}</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Activity Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="block text-3xl font-black text-blue-600">{stats.total_workouts}</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase">Sessions</span>
          </div>
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <span className="block text-3xl font-black text-orange-600">{stats.total_sets}</span>
            <span className="text-[10px] font-bold text-orange-400 uppercase">Total Sets</span>
          </div>
        </div>

        {stats.last_workout && (
          <div className="mt-4 p-4 bg-gray-50 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Last Active</span>
            <span className="font-bold text-gray-700">
              {new Date(stats.last_workout).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      <button
        onClick={logout}
        className="w-full bg-red-50 text-red-500 p-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
      >
        Logout
      </button>
    </div>
  )
}

export default Profile