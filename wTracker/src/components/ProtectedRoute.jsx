import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './ui/Spinner'

const ProtectedRoute = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return <Spinner />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <Outlet />
    )
}

export default ProtectedRoute