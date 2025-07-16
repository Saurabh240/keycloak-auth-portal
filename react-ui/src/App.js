import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import { useEffect, useState } from 'react';
import AppList from './AppList';
import AdminPage from './AdminPage';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/auth',
  realm: 'euranix',
  clientId: 'portal-ui',
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(auth => {
      if (auth) {
        setAuthenticated(true);
        setRoles(keycloak.tokenParsed?.realm_access?.roles || []);
        setToken(keycloak.token);
      }
    });
  }, []);

  if (!authenticated) return <div>Loading...</div>;

  const hasAdminRole = roles.some(role => role.includes('admin'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppList keycloak={keycloak} roles={roles} />} />
        <Route path="/admin" element={hasAdminRole ? <AdminPage keycloak={keycloak} token={token} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
