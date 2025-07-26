import { Loader2, UserPlus, X, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"

const UserModal = ({ isOpen, onClose, onSubmit, loading, apps = [], editingUser = null }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        enabled: true,
        clientRoles: {}
    })

    const [expandedApps, setExpandedApps] = useState({})

    useEffect(() => {
        if (editingUser) {
            setFormData({
                username: editingUser.username || '',
                email: editingUser.email || '',
                firstName: editingUser.firstName || '',
                lastName: editingUser.lastName || '',
                password: '', // Don't populate password for editing
                enabled: editingUser.enabled ?? true,
                clientRoles: editingUser.clientRoles || {}
            })
        } else {
            setFormData({
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                enabled: true,
                clientRoles: {}
            })
        }
    }, [editingUser])

    const toggleAppExpansion = (clientId) => {
        setExpandedApps(prev => ({
            ...prev,
            [clientId]: !prev[clientId]
        }))
    }

    const handleRoleToggle = (clientId, role) => {
        setFormData(prev => {
            const currentRoles = prev.clientRoles[clientId] || []
            const updatedRoles = currentRoles.includes(role)
                ? currentRoles.filter(r => r !== role)
                : [...currentRoles, role]

            const newClientRoles = { ...prev.clientRoles }
            if (updatedRoles.length === 0) {
                delete newClientRoles[clientId]
            } else {
                newClientRoles[clientId] = updatedRoles
            }

            return {
                ...prev,
                clientRoles: newClientRoles
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.username || !formData.email || !formData.firstName || !formData.lastName) {
            alert('Please fill in all required fields')
            return
        }

        if (!editingUser && !formData.password) {
            alert('Password is required for new users')
            return
        }

        // Prepare submission data
        const submitData = {
            username: formData.username,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            enabled: formData.enabled,
            clientRoles: formData.clientRoles
        }

        // Only include password for new users
        if (!editingUser && formData.password) {
            submitData.password = formData.password
        }

        try {
            await onSubmit(submitData)
        } catch (error) {
            console.error('Submit error:', error)
        }
    }

    const handleClose = () => {
        setFormData({
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            enabled: true,
            clientRoles: {}
        })
        setExpandedApps({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
                <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <UserPlus className="w-6 h-6" />
                            <h2 className="text-xl font-bold">
                                {editingUser ? 'Edit User' : 'Create New User'}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-blue-200 hover:text-white transition-colors duration-200 p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic User Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 border-b border-gray-200 pb-2">
                            User Information
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter username"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter email address"
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="First name"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Last name"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {!editingUser && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Enter password"
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="enabled"
                                checked={formData.enabled}
                                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                disabled={loading}
                            />
                            <label htmlFor="enabled" className="text-sm font-medium text-slate-700">
                                User enabled
                            </label>
                        </div>
                    </div>

                    {/* Role Assignment Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-gray-200 pb-2 flex-1">
                                Role Assignment
                            </h3>
                            {apps.length > 0 && (
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const allRoles = {}
                                            apps.forEach(app => {
                                                allRoles[app.clientId] = [...app.roles]
                                            })
                                            setFormData(prev => ({
                                                ...prev,
                                                clientRoles: allRoles
                                            }))
                                            // Expand all apps when selecting all
                                            const expandAll = {}
                                            apps.forEach(app => {
                                                expandAll[app.clientId] = true
                                            })
                                            setExpandedApps(expandAll)
                                        }}
                                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors duration-200"
                                        disabled={loading}
                                    >
                                        Grant All Roles
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                clientRoles: {}
                                            }))
                                        }}
                                        className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full transition-colors duration-200"
                                        disabled={loading}
                                    >
                                        Clear All Roles
                                    </button>
                                </div>
                            )}
                        </div>

                        {apps.length === 0 ? (
                            <p className="text-gray-500 text-sm">No applications available for role assignment.</p>
                        ) : (
                            <div className="space-y-3">
                                {apps.map((app) => {
                                    const isExpanded = expandedApps[app.clientId]
                                    const userRoles = formData.clientRoles[app.clientId] || []

                                    return (
                                        <div key={app.clientId} className="border border-gray-200 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => toggleAppExpansion(app.clientId)}
                                                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                                                disabled={loading}
                                            >
                                                <div>
                                                    <div className="font-medium text-slate-800">{app.name}</div>
                                                    <div className="text-sm text-gray-500">Client ID: {app.clientId}</div>
                                                    {userRoles.length > 0 && (
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {userRoles.map((role) => (
                                                                <span key={role} className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${role === 'admin'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {role}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 border-t border-gray-100">
                                                    <div className="mt-3 space-y-3">
                                                        {/* Select All / Deselect All */}
                                                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                                            <span className="text-sm font-medium text-gray-600">
                                                                Available Roles:
                                                            </span>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            clientRoles: {
                                                                                ...prev.clientRoles,
                                                                                [app.clientId]: [...app.roles]
                                                                            }
                                                                        }))
                                                                    }}
                                                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                                    disabled={loading}
                                                                >
                                                                    Select All
                                                                </button>
                                                                <span className="text-gray-300">|</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData(prev => {
                                                                            const newClientRoles = { ...prev.clientRoles }
                                                                            delete newClientRoles[app.clientId]
                                                                            return {
                                                                                ...prev,
                                                                                clientRoles: newClientRoles
                                                                            }
                                                                        })
                                                                    }}
                                                                    className="text-xs text-red-600 hover:text-red-800 underline"
                                                                    disabled={loading}
                                                                >
                                                                    Clear All
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Role Checkboxes */}
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {app.roles.map((role) => (
                                                                <label key={role} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-gray-200">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={userRoles.includes(role)}
                                                                        onChange={() => handleRoleToggle(app.clientId, role)}
                                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                        disabled={loading}
                                                                    />
                                                                    <div className="flex items-center space-x-2 flex-1">
                                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${role === 'admin'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : role === 'manager'
                                                                                ? 'bg-purple-100 text-purple-800'
                                                                                : 'bg-blue-100 text-blue-800'
                                                                            }`}>
                                                                            {role}
                                                                        </span>
                                                                        <span className="text-sm text-gray-600">
                                                                            {role === 'admin' && '(Full administrative access)'}
                                                                            {role === 'user' && '(Standard user access)'}
                                                                        </span>
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>

                                                        {/* Selected Roles Preview */}
                                                        {userRoles.length > 0 && (
                                                            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                                                <div className="text-xs font-medium text-blue-800 mb-1">
                                                                    Selected roles for {app.name}:
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {userRoles.map((role) => (
                                                                        <span key={role} className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${role === 'admin'
                                                                            ? 'bg-red-200 text-red-800'
                                                                            : role === 'manager'
                                                                                ? 'bg-purple-200 text-purple-800'
                                                                                : 'bg-blue-200 text-blue-800'
                                                                            }`}>
                                                                            {role}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-slate-700 hover:from-blue-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{editingUser ? 'Updating...' : 'Creating...'}</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    <span>{editingUser ? 'Update User' : 'Create User'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserModal;