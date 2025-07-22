import { useEffect, useState } from 'react'
import { getApps } from '../services/api'
import AppCard from '../AppCard'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'


function AppListingPage() {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchApps = async () => {
        try {
            const data = await getApps();
            console.log('API Response:', data);
            setApps(data);
            setLoading(false)
        } catch (err) {
            setError('Failed to fetch apps')
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchApps()
    }, [])

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Loading Applications</h2>
                    <p className="text-gray-500">Please wait while we fetch the latest business solutions...</p>
                </div>
            </div>
        )
    }
    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Oops! Something went wrong</h2>
                    <p className="text-red-600 mb-6 leading-relaxed">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={fetchApps}
                            className="w-full bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Try Again</span>
                        </button>
                        <p className="text-sm text-gray-500">
                            If the problem persists, please contact support
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
            <div className="container mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Available Applications</h1>
                    <p className="text-gray-600">Discover powerful business solutions tailored for your needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(apps) && apps.length > 0 ? (
                        apps.map((app, index) => (
                            <AppCard key={app.id || index} app={app} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">📱</span>
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-800 mb-2">No Applications Available</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                We're currently updating our application catalog. Please check back later for new business solutions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppListingPage