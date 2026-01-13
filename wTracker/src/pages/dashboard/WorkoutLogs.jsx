import React, { useEffect, useState } from 'react'
import { createWorkout, fetchWorkoutLogs } from '../../api/workout'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../../components/ui/spinner'

const WorkoutLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split('T')[0],  // Default to today
    notes: ""
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const created = await createWorkout(newWorkout)

      navigate(`/dashboard/logs/${created.id}`)
    } catch (err) {
      alert("Failed to create workout session")
    }
  }

  useEffect(() => {
    fetchWorkoutLogs()
      .then((data) => {
        console.log(data);
        setLogs(data.results || data)
        // since we have paginated data
      })
      .catch(() => {
        console.error("Failed to fetch logs:", err);
        setLogs([]);
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner/>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Workout Logs</h2>

      <form onSubmit={handleCreate} className="mb-8 p-4 bg-blue-50 rounded-lg flex gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">DATE</label>
          <input type="date"
            value={newWorkout.date}
            onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-2">
          <label className="block text-xs font-bold text-gray-500 mb-1">NOTES (OPTIONAL)</label>
          <input
            type="text"
            placeholder="e.g. Heavy Leg Day"
            value={newWorkout.notes}
            onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
          + Start Workout
        </button>
      </form>

      <div className="space-y-3">
        {logs?.map((log) => (
          <Link
            key={log.id}
            to={`/dashboard/logs/${log.id}`}
            className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-blue-900">
                  {log.notes || "Unnamed Workout"}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(log.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-gray-400">
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