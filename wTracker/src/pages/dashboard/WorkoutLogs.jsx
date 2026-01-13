import React, { useEffect, useState } from 'react'
import { createWorkout, fetchWorkoutLogs } from '../../api/workout'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../../components/ui/spinner'
import EmptyState from '../../components/ui/EmptyState'
import { notifyError, notifySuccess } from '../../utils/notify'

const WorkoutLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],  // Default to today
    notes: ""
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const created = await createWorkout(newWorkout)
      notifySuccess("New workout session created")
      navigate(`/dashboard/logs/${created.id}`)
    } catch (err) {
      notifyError("Failed to create workout session")
    }
  }

  useEffect(() => {
    fetchWorkoutLogs()
      .then((data) => {
        console.log(data);
        setLogs(data.results || data)
        // since we have paginated data
      })
      .catch((err) => {
        console.error("Failed to fetch logs:", err);
        setLogs([]);
        setError(err);
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error) {
    return (
      <div className="wt-app-shell wt-page">
        <EmptyState
          title="We couldn't load your workout history."
          action={
            <span>
              Please pull down to refresh on mobile or try again in a moment.
            </span>
          }
        />
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="wt-app-shell wt-page wt-page-with-bottom-nav">
        <h2 className="wt-page-title mb-4">Workout Logs</h2>
      <form onSubmit={handleCreate} className="mb-6 p-4 md:p-5 wt-card-soft flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2 tracking-wider">
            Date
          </label>
          <input
            type="date"
            value={newWorkout.date}
            onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
            className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm"
            required
          />
        </div>
        <div className="flex-[1.4] w-full">
          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2 tracking-wider">
            Notes (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Heavy leg day"
            value={newWorkout.notes}
            onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
            className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button type="submit" className="wt-btn-primary w-full md:w-auto mt-0 md:mt-0 md:ml-2">
          + Start Workout
        </button>
      </form>
        <EmptyState
          title="No workouts yet."
          action={
            <span>
              Start your first workout above to begin tracking your progress.
            </span>
          }
        />
      </div>
    )
  }

  return (
    <div className="wt-app-shell wt-page wt-page-with-bottom-nav">
      <h2 className="wt-page-title mb-4">Workout Logs</h2>

      <form onSubmit={handleCreate} className="mb-6 p-4 md:p-5 wt-card-soft flex flex-col gap-4 md:flex-row md:items-end">
        <div className="w-full md:w-auto">
          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Date</label>
          <input type="date"
            value={newWorkout.date}
            onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
            className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm"
            required
          />
        </div>
        <div className="flex-2 flex-1 w-full">
          <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2 tracking-wider">Notes (optional)</label>
          <input
            type="text"
            placeholder="e.g. Heavy Leg Day"
            value={newWorkout.notes}
            onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
            className="w-full p-2.5 md:p-3 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm"
          />
        </div>
        <button type="submit" className="wt-btn-primary w-full md:w-auto mt-0 md:mt-0 md:ml-2">
          + Start Workout
        </button>
      </form>

      <div className="space-y-3">
        {logs?.map((log) => (
          <Link
            key={log.id}
            to={`/dashboard/logs/${log.id}`}
            className="block bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:border-red-300 hover:scale-[1.01] transition-all duration-200 group"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900 group-hover:text-red-700 transition-colors">
                  {log.notes || "Unnamed Workout"}
                </p>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">
                  {new Date(log.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-red-600 transition-colors ml-4 text-xl font-bold">
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default WorkoutLogs