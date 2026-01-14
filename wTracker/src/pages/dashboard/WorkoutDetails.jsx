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
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { notifyError, notifySuccess } from '../../utils/notify'

const WorkoutDetails = () => {
  const { logId } = useParams()
  const navigate = useNavigate()

  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")
  const [newExerciseName, setNewExerciseName] = useState("")

  useEffect(() => {
    fetchWorkoutDetail(logId)
      .then((data) => {
        setWorkout(data)
        setEditedNotes(data.notes || "")
      })
      .catch((err) => {
        console.error(err)
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [logId])

  const handleUpdate = async () => {
    try {
      const updated = await updateWorkout(logId, { notes: editedNotes })
      setWorkout(updated)
      setIsEditing(false)
    } catch (err) {
      notifyError("Failed to update workout notes")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(logId)
        notifySuccess("Workout deleted")
        navigate("/dashboard")
      } catch (err) {
        notifyError("Failed to delete workout")
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
      notifyError("Failed to add exercise")
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
      } catch (err) { notifyError("Failed to delete exercise") }
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
    } catch (err) { notifyError("Failed to delete set") }
  }

  if (loading) return <Spinner />
  if (error) {
    return (
      <div className="wt-app-shell wt-page">
        <EmptyState
          title="We couldn't open this workout."
          action={<span>Try going back to the dashboard and opening it again.</span>}
        />
      </div>
    )
  }
  if (!workout) {
    return (
      <div className="wt-app-shell wt-page">
        <EmptyState title="Workout not found." />
      </div>
    )
  }

  return (
    <div className="wt-app-shell wt-page wt-page-with-bottom-nav max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2 group font-medium">
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
        </Link>
        <button
          onClick={handleDelete}
          className="bg-white text-red-600 border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          Delete Session
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8 hover:shadow-lg transition-all">
        {isEditing ? (
          <div className="space-y-4">
            <input
              className="w-full text-3xl font-bold border-b-2 border-red-600 focus:outline-none focus:border-red-700 py-2 transition-colors text-gray-900"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-red-700 hover:scale-105 active:scale-95 transition-all">Save</button>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 font-medium px-4 hover:text-gray-700 transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight mb-2">
                {workout.notes || "Workout Session"}
              </h2>
              <p className="text-gray-600 font-medium">
                {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={() => setIsEditing(true)} className="text-red-600 p-2.5 hover:bg-red-50 rounded-full transition-all hover:scale-110 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* EXERCISES SECTION */}
      <div className="space-y-6">
        {(!workout.exercises || workout.exercises.length === 0) && (
          <EmptyState
            title="No exercises in this session yet."
            action={
              <span>
                Add your first exercise using the bar fixed at the bottom of the screen.
              </span>
            }
          />
        )}
        {workout.exercises?.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group hover:shadow-lg hover:border-red-300 transition-all">
            <div className="flex justify-between items-center bg-gradient-to-r from-red-50 to-white px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight">{exercise.name}</h3>
              <button
                onClick={() => handleDeleteExercise(exercise.id)}
                className="text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {exercise.sets?.map((set, index) => (
                  <div key={set.id} className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 group/set transition-all border border-transparent hover:border-gray-200">
                    <div className="grid grid-cols-3 flex-1 items-center gap-4">
                      <span className="text-xs font-black text-red-600 uppercase tracking-wider">Set {index + 1}</span>
                      <span className="text-gray-900 font-bold text-base">{set.weight} <span className="text-gray-500 font-normal text-xs uppercase ml-1">kg</span></span>
                      <span className="text-gray-900 font-bold text-base">{set.reps} <span className="text-gray-500 font-normal text-xs uppercase ml-1">reps</span></span>
                    </div>
                    <button
                      onClick={() => handleDeleteSet(exercise.id, set.id)}
                      className="opacity-0 group-hover/set:opacity-100 text-gray-400 hover:text-red-600 transition-all ml-4 hover:scale-110 active:scale-95 font-bold"
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
      <div className="fixed bottom-18.5 md:bottom-0 left-0 md:left-64 right-0 p-3 md:p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto flex gap-2 md:gap-3">
          <input
            type="text"
            placeholder="Next exercise..."
            className="flex-1 p-3 md:p-4 bg-gray-50 border border-gray-300 rounded-xl md:rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-semibold placeholder:text-gray-400 shadow-sm text-sm md:text-base"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && handleAddExercise()}
          />
          <button
            onClick={handleAddExercise}
            className="bg-red-600 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black shadow-lg hover:bg-red-700 active:scale-95 md:hover:scale-105 transition-all text-sm md:text-base"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkoutDetails