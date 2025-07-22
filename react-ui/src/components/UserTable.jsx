function UserTable({ users, onEdit, onDelete }) {
    return (
        <table className="w-full border-collapse border border-black">
            <thead>
                <tr className="bg-black text-white">
                    <th className="border border-black p-2">Username</th>
                    <th className="border border-black p-2">Email</th>
                    <th className="border border-black p-2">First Name</th>
                    <th className="border border-black p-2">Last Name</th>
                    <th className="border border-black p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border border-black p-2">{user.username}</td>
                        <td className="border border-black p-2">{user.email}</td>
                        <td className="border border-black p-2">{user.firstName}</td>
                        <td className="border border-black p-2">{user.lastName}</td>
                        <td className="border border-black p-2">
                            <button
                                onClick={() => onEdit(user)}
                                className="mr-2 text-blue-600 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(user.id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default UserTable