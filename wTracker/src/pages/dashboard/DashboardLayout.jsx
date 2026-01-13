import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navigation from '../../components/Navigation'

const DashboardLayout = () => {
    const { logout } = useAuth

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <Navigation />
            {/* - On mobile: no margin-left, but add padding-bottom (pb-20) so the bottom nav doesn't hide content.
            - On desktop: add margin-left (md:ml-64) so it clears the sidebar.
            */}
            <main className="flex-1 md:ml-64 p-3 md:p-4 pb-24 md:pb-10 min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout