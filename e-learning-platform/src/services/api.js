import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const recommendationService = {
    getRecommendations: async (studentId) => {
        const response = await axios.get(`${API_BASE_URL}/recommendations/${studentId}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    },

    getCourses: async (categoryId) => {
        const response = await axios.get(`${API_BASE_URL}/courses`, {
            params: { category: categoryId }
        });
        return response.data;
    }
};
