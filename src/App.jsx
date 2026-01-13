import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import WorkoutLogs from './pages/dashboard/WorkoutLogs'
import Register from './pages/auth/Register'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import WorkoutDetails from './pages/dashboard/WorkoutDetails'
import Profile from './pages/dashboard/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    // DECLARATIVE
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />

      <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<DashboardLayout/>}>
          <Route index element={<WorkoutLogs/>}/>
          <Route path='logs/:logId' element={<WorkoutDetails/>}/>
          <Route path='profile' element={<Profile/>}/>
        </Route>
      </Route>

      <Route path='*' element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
