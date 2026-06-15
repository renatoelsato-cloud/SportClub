import axios from 'axios';

const API_URL = 'http://localhost:3000/api/sport'; 

const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const sportsService = {
    getAll: async () => {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },
    create: async (sportData) => {
        const response = await axios.post(API_URL, sportData, getAuthHeaders());
        return response.data;
    },
    update: async (id, sportData) => {
        const response = await axios.put(`${API_URL}/${id}`, sportData, getAuthHeaders());
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    },
    changeStatus: async (id, newStatus) => {
        const response = await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, getAuthHeaders());
        return response.data;
    }
};
