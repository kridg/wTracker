import { notifyError } from "../utils/notify"
import api from "./axios"
import publicApi from "./publicAxios"

export const fetchWorkoutLogs = async () => {
  try {
    const res = await api.get("/logs/")
    return res.data
  } catch (error) {
    notifyError(error.response?.data?.detail||"Failed to load Workouts")
    throw error;
  }
}

export const fetchWorkoutDetail = async (logId) => {
  try {
    const res = await api.get(`/logs/${logId}`)
    return res.data
  } catch (error) {
    notifyError(error.response?.data?.detail||"Failed to fetch Workout Detail")
    console.error("Fetch Detail Error:", error.response?.data);
    throw error;
  }
}

// Workout CRUD
export const deleteWorkout=async(id)=>{
  return await api.delete(`/logs/${id}/`)
}

export const createWorkout=async(workoutData)=>{
  const response=await api.post("/logs/",workoutData)
  return response.data
}

export const updateWorkout=async(id,workoutData)=>{
  const response=await api.patch(`/logs/${id}/`,workoutData)
  return response.data
}

// Exercise CRUD
export const createExercise = async (logId, exerciseData) => {
    // exerciseData = { name: "Bench Press", order: 1 }
    const response = await api.post(`/logs/${logId}/exercises/`, exerciseData);
    return response.data;
}

export const deleteExercise = async (id) => {
    return await api.delete(`/exercises/${id}/`);
};

// Set CRUD
export const createSet = async (exerciseId, setData) => {
    // setData = { weight: 80, reps: 10, order: 1 }
    const response = await api.post(`/exercises/${exerciseId}/sets/`, setData);
    return response.data;
}

export const deleteSet = async (id) => {
    return await api.delete(`/sets/${id}/`);
};

export const updateSet = async (id, setData) => {
    const response = await api.patch(`/sets/${id}/`, setData);
    return response.data;
};

export const fetchProfileStats = async () => {
    const response = await api.get('/stats/'); 
    return response.data;
};