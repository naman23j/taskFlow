import api from './api';
import { clearStoredToken, setStoredToken } from '../utils/localStorage';

async function register(name, email, password, passwordConfirm) {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
    passwordConfirm,
  });
  setStoredToken(response.data.token);
  return response.data;
}

async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  setStoredToken(response.data.token);
  return response.data;
}

async function logout() {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } finally {
    clearStoredToken();
  }
}

async function getMe() {
  const response = await api.get('/auth/me');
  return response.data;
}

export default {
  register,
  login,
  logout,
  getMe,
};
