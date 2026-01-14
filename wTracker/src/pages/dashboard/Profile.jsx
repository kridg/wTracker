import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchProfileStats } from '../../api/workout'
import EmptyState from '../../components/ui/EmptyState'
import { notifyError, notifySuccess } from '../../utils/notify'
import { Activity, BarChart2, Clock3, LogOut } from 'lucide-react'
import Spinner from '../../components/ui/spinner'

const Profile = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({ total_workouts: 0, total_sets: 0, last_workout: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfileStats()
      .then(data => setStats(data))
      .catch(err => {
        console.error("Error fetching stats", err)
        setError(err)
        notifyError("Failed to load your training stats")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  if (error) {
    return (
      <div className="wt-app-shell wt-page">
        <EmptyState title="We couldn't load your profile details right now." />
      </div>
    )
  }

  return (
    <div className="wt-app-shell wt-page max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg hover:scale-105 transition-transform">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{user?.username}</h2>
        <p className="text-sm text-gray-600 font-medium">{user?.email}</p>
      </div>

      <div className="wt-card-soft p-6 mb-6">
        <h3 className="text-xs font-black text-gray-700 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
          <Activity className="w-3 h-3 text-red-600" />
          Activity overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all">
            <span className="block text-3xl font-black text-gray-900 mb-1">{stats.total_workouts}</span>
            <span className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1 tracking-wider">
              <BarChart2 className="w-3 h-3 text-red-600" />
              Sessions
            </span>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all">
            <span className="block text-3xl font-black text-gray-900 mb-1">{stats.total_sets}</span>
            <span className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1 tracking-wider">
              <BarChart2 className="w-3 h-3 text-red-600" />
              Total Sets
            </span>
          </div>
        </div>

        {stats.last_workout && (
          <div className="mt-4 p-4 bg-white rounded-xl text-center border border-gray-200 flex items-center justify-between hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600">
                <Clock3 className="w-4 h-4" />
              </span>
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5 tracking-wider">Last active</span>
                <span className="font-semibold text-gray-900 text-sm">
              {new Date(stats.last_workout).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          logout()
          notifySuccess("Logged out")
        }}
        className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-gray-300 p-3.5 rounded-xl font-semibold hover:bg-red-50 hover:border-red-400 hover:scale-105 active:scale-95 transition-all shadow-md text-sm"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  )
}

export default Profile