import { useEffect, useState } from 'react'
import keycloak from './keycloak'
import { jwtDecode } from 'jwt-decode'
import AppListingPage from './pages/AppListingPage'
import AdminUserManagementPage from './pages/AdminUserManagementPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        if (authenticated) {
          const decoded = jwtDecode(keycloak.token)
          const uid = decoded.sub

          // ✅ Store token & userId with correct keys
          setIsAuthenticated(true)
          setToken(keycloak.token)
          setUserId(uid)

          localStorage.setItem('keycloak_token', keycloak.token)
          localStorage.setItem('userId', uid)
          localStorage.setItem('user', JSON.stringify(decoded))
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error)
      })

    // Token refresh setup
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).then((refreshed) => {
        if (refreshed) {
          setToken(keycloak.token)
          localStorage.setItem('keycloak_token', keycloak.token)
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
      <BrowserRouter>
        <Routes>
          {/* <h1>App List Page</h1>
      <p>User ID from token: {userId}</p> */}
          <Route path="/" element={<AppListingPage />} />
          <Route path="/admin/users/:clientId" element={<AdminUserManagementPage />} />
          {/* Example: call API to fetch apps */}
          {/* <FetchAppsButton token={token} userId={userId} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// function FetchAppsButton({ token, userId }) {
//   console.log(' in FetchAppsButton');
//   const fetchApps = () => {
//     fetch(`http://localhost:8081/admin/users/${userId}/apps/`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => {
//         console.log('in FetchAppsButton');
//         return res.json();
//       })
//       .then(data => console.log('Apps:', data))
//       .catch(err => console.error('Error fetching apps', err));
//   };

//   return (
//     <button onClick={fetchApps}>Fetch Apps for User</button>
//   );
// }

export default App;