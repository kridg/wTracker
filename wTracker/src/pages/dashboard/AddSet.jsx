import React, { useState } from 'react'
import { createSet } from '../../api/workout';

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
            alert("Failed to save set. Check your backend console.")
        }


    }
    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="mt-2 w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 hover:text-blue-500 hover:border-blue-500 rounded-lg font-medium transition-all"
            >
                + Add Set
            </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-3 bg-blue-50 rounded-xl animate-in fade-in zoom-in duration-200">
            <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                    <label className="block text-[10px] font-bold text-blue-400 uppercase ml-1 mb-1">Weight</label>
                    <input
                        type="number"
                        placeholder="kg"
                        className="w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-blue-400 uppercase ml-1 mb-1">Reps</label>
                    <input
                        type="number"
                        placeholder="0"
                        className="w-full p-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                </div>
                <div className="flex items-end gap-1">
                    <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded-lg font-bold shadow-md">✓</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-white text-gray-400 p-2 rounded-lg font-bold shadow-sm">✕</button>
                </div>
            </div>
        </form>
    )
}

export default AddSet