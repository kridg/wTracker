import React, { useState } from 'react'
import { createSet } from '../../api/workout';
import { notifyError, notifySuccess } from '../../utils/notify'

const AddSet = ({ exerciseId, onSetAdded, nextOrder }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!weight || weight < 0 || !reps || reps < 0) return

        try {
            const newSet = await createSet(exerciseId, {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                order: nextOrder
            })
            // Tell the Parent (WorkoutDetails) that a new set was created
            onSetAdded(exerciseId, newSet)
            setReps("");
            setIsAdding(false);
        } catch (err) {
            console.error(err)
            notifyError("Failed to save set. Check your backend console.")
        }


    }
    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="mt-3 w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-500 hover:bg-red-50 rounded-lg font-semibold transition-all text-sm hover:scale-[1.01] active:scale-95"
            >
                + Add Set
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-300 animate-in fade-in zoom-in duration-200 shadow-sm">
            <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase ml-1 mb-2 tracking-wider">Weight</label>
                    <input
                        type="number"
                        placeholder="kg"
                        className="w-full p-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none shadow-sm transition-all font-semibold"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase ml-1 mb-2 tracking-wider">Reps</label>
                    <input
                        type="number"
                        placeholder="0"
                        className="w-full p-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none shadow-sm transition-all font-semibold"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                </div>
                <div className="flex items-end gap-1.5">
                    <button type="submit" className="flex-1 bg-red-600 text-white p-2.5 rounded-lg font-bold shadow-md hover:bg-red-700 hover:scale-105 active:scale-95 transition-all">✓</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white text-gray-500 border border-gray-300 p-2.5 rounded-lg font-bold shadow-sm hover:text-gray-700 hover:border-gray-400 hover:scale-105 active:scale-95 transition-all">✕</button>
                </div>
            </div>
        </form>
    )
}

export default AddSet