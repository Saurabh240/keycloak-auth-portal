import { useEffect, useState, Suspense } from 'react'
import keycloak from './keycloak'
import { jwtDecode } from 'jwt-decode'
import AppListingPage from './pages/AppListingPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [hasAdminRole, setHasAdminRole] = useState(false)
  const [showAdminPage, setShowAdminPage] = useState(false)

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated)
        if (authenticated) {
          setToken(keycloak.token)
          const decoded = jwtDecode(keycloak.token)
          console.log('Decoded token', decoded)
          setUserId(decoded.sub)
          localStorage.setItem('token', keycloak.token)
          localStorage.setItem('sub', decoded.sub)
          localStorage.setItem('user', JSON.stringify(decoded))
          setHasAdminRole(keycloak.hasRealmRole('admin'))
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error)
      })

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).then((refreshed) => {
        if (refreshed) {
          setToken(keycloak.token)
          localStorage.setItem('token', keycloak.token)
        }
      })
    }

    return () => {
      keycloak.onTokenExpired = null
    }
  }, [])

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>
  }
  return (
    <div>
      <h1>App List Page</h1>
      <p>User ID from token: {userId}</p>
      <AppListingPage />
      {/* Example: call API to fetch apps */}
      {/* <FetchAppsButton token={token} userId={userId} /> */}
    </div>
  );
}

function FetchAppsButton({ token, userId }) {
  console.log(' in FetchAppsButton');
  const fetchApps = () => {
    fetch(`http://localhost:8081/admin/users/${userId}/apps/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log('in FetchAppsButton');
        return res.json();
      })
      .then(data => console.log('Apps:', data))
      .catch(err => console.error('Error fetching apps', err));
  };

  return (
    <button onClick={fetchApps}>Fetch Apps for User</button>
  );
}

export default App;