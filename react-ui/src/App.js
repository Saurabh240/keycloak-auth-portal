import React, { useEffect, useState } from 'react';
import keycloak from './keycloak';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    }).then(authenticated => {
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setToken(keycloak.token);
        const decoded = jwtDecode(keycloak.token);
        console.log('Decoded token', decoded);
        setUserId(decoded.sub);
      }
    });

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).then(refreshed => {
        if (refreshed) {
          setToken(keycloak.token);
        }
      });
    };
  }, []);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>App List Page</h1>
      <p>User ID from token: {userId}</p>

      {/* Example: call API to fetch apps */}
      <FetchAppsButton token={token} userId={userId} />
    </div>
  );
}

function FetchAppsButton({ token, userId }) {
  const fetchApps = () => {
    fetch(`http://localhost:8081/admin/users/${userId}/apps/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => console.log('Apps:', data))
      .catch(err => console.error('Error fetching apps', err));
  };

  return (
    <button onClick={fetchApps}>Fetch Apps for User</button>
  );
}

export default App;
