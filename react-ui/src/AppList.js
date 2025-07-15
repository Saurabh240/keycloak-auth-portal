import React from 'react';

const AppList = ({ keycloak }) => {
  const apps = [
    { name: 'Frappe App Ant', url: 'https://frappe-app-ant.com' },
    { name: 'Frappe App Bat', url: 'https://frappe-app-bat.com' },
    { name: 'Custom Android App', url: 'https://custom-app.com' },
  ];

  return (
    <div>
      <h2>Available Applications</h2>
      <ul>
        {apps.map(app => (
          <li key={app.name}>
            <a href={app.url}>Open {app.name}</a>
          </li>
        ))}
      </ul>
      <button onClick={() => keycloak.logout()}>Logout</button>
    </div>
  );
};

export default AppList;
