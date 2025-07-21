import { useEffect, useState } from 'react'

import { getApps } from '../services/api'
import { AppCard } from '../AppCard'

function AppListingPage({ userId }) {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await getApps()
                setApps(data)
                setLoading(false)
            } catch (err) {
                setError('Failed to fetch apps')
                setLoading(false)
            }
        }
        fetchApps()
    }, [])

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Available Applications for User ID: {userId}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apps.map((app, index) => (
                    <AppCard app={app} />
                ))}
            </div>
        </div>
    )
}

export default AppListingPage