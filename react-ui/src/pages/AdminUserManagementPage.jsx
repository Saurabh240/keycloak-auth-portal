import { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../services/api'
import UserTable from '../components/UserTable'

function AdminUserManagementPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        enabled: true,
    })

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers()
                setUsers(data)
                setLoading(false)
            } catch (err) {
                setError('Failed to fetch users')
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleCreateUser = async (e) => {
        e.preventDefault()
        try {
            await createUser(newUser)
            const updatedUsers = await getUsers()
            setUsers(updatedUsers)
            setNewUser({ username: '', email: '', firstName: '', lastName: '', enabled: true })
        } catch (err) {
            setError('Failed to create user')
        }
    }

    const handleEditUser = async (user) => {
        const updatedData = prompt('Enter new email for user:', user.email)
        if (updatedData) {
            try {
                await updateUser(user.id, { ...user, email: updatedData })
                const updatedUsers = await getUsers()
                setUsers(updatedUsers)
            } catch (err) {
                setError('Failed to update user')
            }
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId)
                const updatedUsers = await getUsers()
                setUsers(updatedUsers)
            } catch (err) {
                setError('Failed to delete user')
            }
        }
    }

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
    if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Create New User</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="border border-black p-2 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="border border-black p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="First Name"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        className="border border-black p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                        className="border border-black p-2 rounded"
                    />
                    <button
                        onClick={handleCreateUser}
                        className="bg-black text-white p-2 rounded hover:bg-gray-800"
                    >
                        Create User
                    </button>
                </div>
            </div>
            <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
        </div>
    )
}

export default AdminUserManagementPage

// import { useParams } from 'react-router-dom';

// const AdminUserManagementPage = () => {
//     const { clientId } = useParams();

//     return (
//         <div>
//             <h1>Managing Users for App ID: {clientId}</h1>
//             {/* Render user list, actions etc */}
//         </div>
//     );
// };

// export default AdminUserManagementPage;
