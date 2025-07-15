import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = ({ keycloak }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/admin/users', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    }).then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users', error));
  }, [keycloak]);

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
