import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PAGE_SIZE = 5;

const AdminPage = ({ keycloak, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://localhost:8081/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  };

  const handleCreateUser = () => {
    axios.post('http://localhost:8081/admin/users', newUser, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setShowModal(false);
        setNewUser({ username: '', email: '', password: '' });
        fetchUsers();
      })
      .catch(() => alert('Error creating user'));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:8081/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => fetchUsers())
        .catch(() => alert('Error deleting user'));
    }
  };

  const handleEditUser = (user) => {
    const updatedEmail = prompt('Enter new email:', user.email);
    if (updatedEmail) {
      axios.put(`http://localhost:8081/admin/users/${user.id}`, { ...user, email: updatedEmail }, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => fetchUsers())
        .catch(() => alert('Error updating user'));
    }
  };

  const paginatedUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Manage Users (Admin Panel)</h2>
        <button onClick={() => keycloak.logout()}>Logout</button>
      </header>

      <button style={{ margin: '1rem 0', padding: '0.5rem 1rem' }} onClick={() => setShowModal(true)}>+ Add User</button>

      {loading && <div>Loading users...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {paginatedUsers.map((user) => (
          <li key={user.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{user.username}</strong> ({user.email}) <br />
              Roles: {user.roles ? user.roles.join(', ') : 'N/A'}
            </div>
            <div>
              <button onClick={() => handleEditUser(user)} style={{ marginRight: '0.5rem' }}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        Page: {currentPage} / {totalPages}
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ marginLeft: '1rem' }}>Previous</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ marginLeft: '0.5rem' }}>Next</button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '300px' }}>
            <h3>Create User</h3>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleCreateUser}>Create</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;