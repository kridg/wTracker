import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createExercise,
  deleteExercise,
  deleteSet,
  deleteWorkout,
  fetchWorkoutDetail,
  updateWorkout
} from '../../api/workout'
import AddSet from './AddSet'
import Spinner from '../../components/ui/spinner'

const WorkoutDetails = () => {
  const { logId } = useParams()
  const navigate = useNavigate()

  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")

  useEffect(() => {
    fetchWorkoutDetail(logId)
      .then((data) => {
        setWorkout(data)
        setEditedNotes(data.notes || "")
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [logId])

  const handleUpdate = async () => {
    try {
      const updated = await updateWorkout(logId, { notes: editedNotes })
      setWorkout(updated)
      setIsEditing(false)
    } catch (err) {
      alert("Update failed")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(logId)
        navigate("/dashboard")
      } catch (err) {
        alert("Deletion Failed")
      }
    }
  }

  const handleAddExercise = async () => {
    if (!newExerciseName.trim()) return

    try {
      const nextOrder = (workout.exercises?.length || 0) + 1
      const created = await createExercise(logId, {
        name: newExerciseName,
        order: nextOrder
      })

      setWorkout({
        ...workout,
        exercises: [...(workout.exercises || []), { ...created, sets: [] }]
      })
      setNewExerciseName("")
    } catch (err) {
      alert("Failed to add exercise")
    }
  }

  const handleSetAdded = (exerciseId, newSet) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => ex.id === exerciseId
        ? { ...ex, sets: [...ex.sets, newSet] } : ex
      )
    }))
  }

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm("Delete this exercise and all its sets?")) {
      try {
        await deleteExercise(exerciseId)
        setWorkout(prev => ({
          ...prev,
          exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
        }))
      } catch (err) { alert("Failed to delete exercise") }
    }
  }

  const handleDeleteSet = async (exerciseId, setId) => {
    try {
      await deleteSet(setId)
      setWorkout(prev => ({
        ...prev,
        exercises: prev.exercises.map(ex =>
          ex.id === exerciseId
            ? { ...ex, sets: ex.sets.filter(s => s.id !== setId) }
            : ex
        )
      }))
    } catch (err) { alert("Failed to delete set") }
  }

  // if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading workout...</div>
  if (loading) return <Spinner/>
  if (!workout) return <div className="p-8 text-center text-red-500 font-bold">Workout not found.</div>

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1">
          <span className="text-lg">←</span> Back to Dashboard
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
        >
          Delete Session
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        {isEditing ? (
          <div className="space-y-4">
            <input
              className="w-full text-3xl font-bold border-b-2 border-blue-500 focus:outline-none py-1"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-700">Save</button>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 font-medium px-4">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                {workout.notes || "Workout Session"}
              </h2>
              <p className="text-gray-400 font-medium mt-2">
                {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={() => setIsEditing(true)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* EXERCISES SECTION */}
      <div className="space-y-6">
        {workout.exercises?.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="flex justify-between items-center bg-gray-50/50 px-6 py-4 border-b border-gray-50">
              <h3 className="text-xl font-extrabold text-blue-900 uppercase tracking-tight">{exercise.name}</h3>
              <button
                onClick={() => handleDeleteExercise(exercise.id)}
                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-1">
                {exercise.sets?.map((set, index) => (
                  <div key={set.id} className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 group/set transition-colors">
                    <div className="grid grid-cols-3 flex-1 items-center">
                      <span className="text-xs font-black text-gray-300 uppercase italic">Set {index + 1}</span>
                      <span className="text-gray-700 font-semibold">{set.weight} <span className="text-gray-400 font-normal text-xs uppercase">kg</span></span>
                      <span className="text-gray-700 font-semibold">{set.reps} <span className="text-gray-400 font-normal text-xs uppercase">reps</span></span>
                    </div>
                    <button
                      onClick={() => handleDeleteSet(exercise.id, set.id)}
                      className="opacity-0 group-hover/set:opacity-100 text-gray-300 hover:text-red-400 transition-all ml-4"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <AddSet
                exerciseId={exercise.id}
                onSetAdded={handleSetAdded}
                nextOrder={exercise.sets.length + 1}
              />
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ADD Exercise */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40 mb-15 md:mb-0">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            placeholder="Next exercise..."
            className="flex-1 p-4 bg-gray-100 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleAddExercise()}
          />
          <button
            onClick={handleAddExercise}
            className="bg-blue-600 text-white px-6 md:px-8 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkoutDetails