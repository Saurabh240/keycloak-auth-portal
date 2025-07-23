import axios from 'axios'
// import { useKeycloak } from './keycloak'
// import { keycloak } from './keycloak'

const api = axios.create({
    baseURL: 'http://localhost:8081',
})

export const setupInterceptors = () => {
    //   const { keycloak } = useKeycloak()
    // const { keycloak } = keycloak
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('keycloak_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )
}

export const getApps = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('keycloak_token');

    console.log('User ID:', userId);
    console.log('Token:', token);

    const response = await api.get(`/admin/users/${userId}/apps`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};


// return [
//     {
//       name: 'Frappe ERP',
//       url: 'https://erp.example.com',
//       roles: ['user', 'admin']
//     },
//     {
//       name: 'Custom Web App',
//       url: 'https://webapp.example.com',
//       roles: ['user']
//     },
//     {
//       name: 'Admin Dashboard',
//       url: 'https://admin.example.com',
//       roles: ['admin']
//     },
//     {
//       name: 'Analytics Portal',
//       url: 'https://analytics.example.com',
//       roles: ['user', 'admin']
//     }
//   ];
//return {
//    "realmRoles": [
//        "default-roles-euranix"
//    ],
//    "user": {
//        "id": "d921fcb6-5292-41d7-bca1-0de28282696b",
//        "username": "saurabh588",
//        "firstName": "Saurabh",
//        "lastName": "Gupta",
//        "email": "saurabh58833@gmail.com",
//        "emailVerified": true,
//        "attributes": null,
//        "userProfileMetadata": null,
//        "self": null,
//        "origin": null,
//        "createdTimestamp": 1752921543223,
//        "enabled": true,
//        "totp": false,
//        "federationLink": null,
//        "serviceAccountClientId": null,
//        "credentials": null,
//        "disableableCredentialTypes": [],
//        "requiredActions": [],
//        "federatedIdentities": null,
//        "realmRoles": null,
//        "clientRoles": null,
//        "clientConsents": null,
//        "notBefore": 0,
//        "applicationRoles": null,
//        "socialLinks": null,
//        "groups": null,
//        "access": {
//            "manageGroupMembership": true,
//            "view": true,
//            "mapRoles": true,
//            "impersonate": true,
//            "manage": true
//        }
//    },
//    "apps": [
//        {
//            "clientId": "client1-app1",
//            "roles": [
//                "admin"
//            ],
//            "name": "Frontend Application",
//            "url": "https://custom-app.example.com"
//        },
//        {
//            "clientId": "client1-app2",
//            "roles": [
//                "user",
//            ],
//            "name": "Frappe Application",
//            "url": "https://frappe.example.com"
//        },
//        // {
//        //     "clientId": "client1-app1",
//        //     "roles": [
//        //         "admin"
//        //     ],
//        //     "name": "Frontend Application",
//        //     "url": "https://custom-app.example.com"
//        // }
//    ]
//}


// ✅ Admin: Get all users
export const getUsers = async () => {
    const response = await api.get('/admin/users')
    return response.data
}

// ✅ Admin: Create user
export const createUser = async (userData) => {
    return api.post('/admin/users', userData)
}

// ✅ Admin: Update user
export const updateUser = async (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData)
}

// ✅ Admin: Delete user
export const deleteUser = async (userId) => {
    return api.delete(`/admin/users/${userId}`)
}