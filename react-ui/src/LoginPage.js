// import React, { useEffect, useState } from 'react';
// import Keycloak from 'keycloak-js';

// const keycloak = new Keycloak({
//     url: 'http://localhost:8080',
//     realm: 'euranix',
//     clientId: 'portal-ui',
// });

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {
//         keycloak
//             .init({ onLoad: 'check-sso', checkLoginIframe: false })
//             .then((authenticated) => {
//                 setIsAuthenticated(authenticated);
//                 if (authenticated) {
//                     // Redirect to main app or dashboard after successful authentication
//                     window.location.href = '/dashboard';
//                 }
//             })
//             .catch((err) => {
//                 console.error('Keycloak initialization failed:', err);
//                 setError('Failed to initialize authentication');
//             });
//     }, []);

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError('');

//         try {
//             await keycloak.login({
//                 loginHint: username,
//                 action: 'login',
//                 redirectUri: window.location.origin + '/dashboard',
//             });
//         } catch (err) {
//             setError('Login failed. Please check your credentials.');
//             console.error('Login error:', err);
//         }
//     };

//     const handleRegister = () => {
//         keycloak.register({
//             redirectUri: window.location.origin + '/dashboard',
//         });
//     };

//     if (isAuthenticated) {
//         return null; // Redirect handled in useEffect
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Euranix</h2>
//                 {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label className="block text-gray-500 mb-2">Username</label>
//                         <input
//                             type="text"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded"
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-500 mb-2">Password</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded"
//                             required
//                         />
//                     </div>
//                     <Button type="submit" className="w-full">
//                         Login
//                     </Button>
//                     <a href="/forgot-password" className="text-gray-500 hover:underline mt-4 block text-center">
//                         Forgot Password?
//                     </a>
//                 </form>
//             </div>
//         </div>

//     );
// };

// export default Login;