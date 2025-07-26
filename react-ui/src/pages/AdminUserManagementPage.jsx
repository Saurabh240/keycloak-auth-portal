import { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser, getApps } from '../services/api'
import UserTable from '../components/UserTable'
import UserModal from '../components/UserModal'
import { AlertCircle, ChevronDown, ChevronUp, Edit, Filter, Loader2, Plus, RefreshCw, Search, Trash2, Users } from 'lucide-react'

function AdminUserManagementPage() {
    const [users, setUsers] = useState([])
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('firstName')
    const [sortDirection, setSortDirection] = useState('asc')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [editingUser, setEditingUser] = useState(null)

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getUsers()
            setUsers(data)
            setLoading(false)
        } catch (err) {
            setError('Failed to fetch users')
            setLoading(false)
        }
    }

    const fetchApps = async () => {
        try {
            const appsData = await getApps()
            setApps(appsData.apps || [])
        } catch (err) {
            console.error('Failed to fetch apps:', err)
        }
    }

    useEffect(() => {
        fetchUsers()
        fetchApps()
    }, [])

    const handleCreateUser = async (userData) => {
        setModalLoading(true)
        try {
            await createUser(userData)
            await fetchUsers()
            setIsModalOpen(false)
            setEditingUser(null)
        } catch (err) {
            setError('Failed to create user')
        }
        setModalLoading(false)
    }

    const handleEditUser = async (user) => {
        setEditingUser(user)
        setIsModalOpen(true)
    }

    const handleUpdateUser = async (userData) => {
        setModalLoading(true)
        try {
            await updateUser(editingUser.id, userData)
            await fetchUsers()
            setIsModalOpen(false)
            setEditingUser(null)
        } catch (err) {
            setError('Failed to update user')
        }
        setModalLoading(false)
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId)
                await fetchUsers()
            } catch (err) {
                setError('Failed to delete user')
            }
        }
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const filteredAndSortedUsers = (users || [])
    .filter(user =>
      !!user && (
        (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a?.[sortField]?.toString().toLowerCase() || ''
      const bValue = b?.[sortField]?.toString().toLowerCase() || ''
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })
  

    const formatClientRoles = (clientRoles) => {
        if (!clientRoles) return []
    
        const excludedClients = ['realm-management', 'account', 'broker']
    
        return Object.entries(clientRoles)
            .filter(([clientId]) => !excludedClients.includes(clientId))
            .map(([clientId, roles]) => {
                const app = apps.find(app => app.clientId === clientId)
                return {
                    appName: app?.name || clientId,
                    roles
                }
            })
    }
    

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                        <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Loading Users</h2>
                    <p className="text-gray-500">Please wait while we fetch user data...</p>
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
                            onClick={fetchUsers}
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
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Users className="w-12 h-12 text-blue-300" />
                            <div>
                                <h1 className="text-4xl font-bold">User Management</h1>
                                <p className="text-blue-100 mt-2">Manage system users and their permissions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setEditingUser(null)
                                setIsModalOpen(true)
                            }}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New User</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                {filteredAndSortedUsers.length} users found
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
                                <tr>
                                    {[
                                        { key: 'firstName', label: 'Name' },
                                        { key: 'username', label: 'Username' },
                                        { key: 'email', label: 'Email' },
                                        { key: 'clientRoles', label: 'App Roles' },
                                        { key: 'enabled', label: 'Status' },
                                        { key: 'actions', label: 'Actions' }
                                    ].map((column) => (
                                        <th
                                            key={column.key}
                                            className={`px-6 py-4 text-left text-sm font-semibold text-slate-700 ${column.key !== 'actions' && column.key !== 'clientRoles' ? 'cursor-pointer hover:bg-blue-100 transition-colors duration-200' : ''
                                                }`}
                                            onClick={() => column.key !== 'actions' && column.key !== 'clientRoles' && handleSort(column.key)}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span>{column.label}</span>
                                                {column.key !== 'actions' && column.key !== 'clientRoles' && sortField === column.key && (
                                                    sortDirection === 'asc' ?
                                                        <ChevronUp className="w-4 h-4" /> :
                                                        <ChevronDown className="w-4 h-4" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAndSortedUsers.map((user, index) => {
                                    const clientRolesFormatted = formatClientRoles(user.clientRoles)

                                    return (
                                        <tr key={user.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{user.username}</td>
                                            <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {clientRolesFormatted.map((appRole, appIndex) => (
                                                        <div key={appIndex} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                                            <div className="text-xs font-semibold text-gray-700 mb-1">
                                                                {appRole.appName}
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {appRole.roles.map((role, roleIndex) => (
                                                                    <span
                                                                        key={roleIndex}
                                                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${role === 'admin'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-blue-100 text-blue-800'
                                                                            }`}
                                                                    >
                                                                        {role}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {clientRolesFormatted.length === 0 && (
                                                        <span className="text-gray-400 text-sm">No roles assigned</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.enabled
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.enabled ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditUser(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                                        title="Edit user"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredAndSortedUsers.length === 0 && (
                        <div className="text-center py-16">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">No users found</h3>
                            <p className="text-gray-600">
                                {searchTerm ?
                                    `No users match "${searchTerm}". Try adjusting your search terms.` :
                                    "No users are currently available."
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* User Creation/Edit Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingUser(null)
                }}
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                loading={modalLoading}
                apps={apps}
                editingUser={editingUser}
            />
        </div>
    )
}

export default AdminUserManagementPage