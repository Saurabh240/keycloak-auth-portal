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

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(auth => {
      setAuthenticated(auth);
      setRoles(keycloak.tokenParsed?.realm_access?.roles || []);
    });
  }, []);

  if (!authenticated) return <div>Loading...</div>;

  const hasAdminRole = roles.includes('admin');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppList keycloak={keycloak} />} />
        <Route path="/admin" element={hasAdminRole ? <AdminPage keycloak={keycloak} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
