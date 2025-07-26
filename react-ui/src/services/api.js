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
const userId = localStorage.getItem('userId');
const token = localStorage.getItem('keycloak_token');

export const getApps = async () => {
    // const userId = localStorage.getItem('userId');
    // const token = localStorage.getItem('keycloak_token');

    console.log('User ID:', userId);
    console.log('Token:', token);

    const response = await api.get(`/admin/users/${userId}/apps`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};


export const getUsers = async () => {
    console.log(token, 'token')
    const response = await api.get('/admin/users', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const createUser = async (userData) => {
    const response = await api.post('/admin/users', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
};
  

// ✅ Admin: Update user
export const updateUser = async (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  // ✅ Admin: Delete user
export const deleteUser = async (userId) => {
    return api.delete(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  