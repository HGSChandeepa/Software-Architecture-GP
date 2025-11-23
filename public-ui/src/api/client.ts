import axios from 'axios';

const API_BASE = {
    auth: 'http://localhost:3001/api/auth',
    stalls: 'http://localhost:3002/api/stalls',
    reservations: 'http://localhost:3003/api/reservations'
};

export const authAPI = {
    login: (email: string, password: string) =>
        axios.post(`${API_BASE.auth}/login`, { email, password }),

    register: (email: string, password: string, name: string, role: string) =>
        axios.post(`${API_BASE.auth}/register`, { email, password, name, role })
};