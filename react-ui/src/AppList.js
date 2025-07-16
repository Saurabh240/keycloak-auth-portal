// Updated AppList.js for role-based app visibility
import React from 'react';
import { Link } from 'react-router-dom';

const AppList = ({ keycloak, roles }) => {
  const allApps = [
    { name: 'Frappe App Ant', url: 'https://frappe-app-ant.com', requiredRole: 'client1-app1-user' },
    { name: 'Frappe App Bat', url: 'https://frappe-app-bat.com', requiredRole: 'client1-app2-user' },
    { name: 'Custom Android App', url: 'https://custom-app.com', requiredRole: 'client2-app1-user' },
  ];

  const accessibleApps = allApps.filter(app => roles.some(role => role === app.requiredRole || role.includes('admin')));

  const isAdmin = roles.some(role => role.includes('admin'));

  return (
    <div>
      <header>
        <h2>Welcome, {keycloak.tokenParsed?.preferred_username}</h2>
        <button onClick={() => keycloak.logout()}>Logout</button>
      </header>

      <h3>Available Applications</h3>
      <ul>
        {accessibleApps.map(app => (
          <li key={app.name}>
            <a href={app.url} target="_blank" rel="noopener noreferrer">{app.name}</a>
          </li>
        ))}
      </ul>

      {isAdmin && (
        <div>
          <h4>Admin Actions</h4>
          <Link to="/admin">Manage Users</Link>
        </div>
      )}
    </div>
  );
};

export default AppList;
