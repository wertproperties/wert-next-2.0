import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api' });

// Attach token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('wert_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wert_token');
    if (token) {
      API.get('/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => localStorage.removeItem('wert_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    localStorage.setItem('wert_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('wert_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('wert_token');
    setUser(null);
  };

  const updateProfile  = async (data) => { const res = await API.put('/auth/profile', data); setUser(res.data.user); return res.data; };
  const changePassword = async (data) => API.put('/auth/change-password', data);

  // Admin methods
  const getAdminStats    = ()           => API.get('/auth/admin/stats');
  const getAllUsers       = ()           => API.get('/auth/admin/users');
  const createUser       = (data)       => API.post('/auth/admin/create', data);
  const updateUser       = (id, data)   => API.put(`/auth/admin/users/${id}`, data);
  const deleteUser       = (id)         => API.delete(`/auth/admin/users/${id}`);

  // Data methods
  const getAllContacts   = ()       => API.get('/contact');
  const getAllDamages    = ()       => API.get('/forms/damage');
  const getAllKeys       = ()       => API.get('/forms/key');
  const getAllTenants    = ()       => API.get('/forms/tenant-change');
  const getAllProperties = ()       => API.get('/properties');
  const seedProperties  = ()       => API.get('/properties/seed');
  const createProperty  = (data)   => API.post('/properties', data);

  return (
    <AuthContext.Provider value={{
      user, loading,
      register, login, logout, updateProfile, changePassword,
      getAdminStats, getAllUsers, createUser, updateUser, deleteUser,
      getAllContacts, getAllDamages, getAllKeys, getAllTenants,
      getAllProperties, seedProperties, createProperty,
      isAdmin: user?.role === 'admin',
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
