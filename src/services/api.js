// src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiService = {
  // Get all journeys
  async getJourneys() {
    try {
      const response = await fetch(`${API_BASE_URL}/get/journey`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching journeys:', error);
      throw error;
    }
  },

  async getTripData() {
  }
};

export default apiService;