// src/services/api.js
const API_BASE_URL = 'https://fastapi-be-htok.onrender.com';

export async function getJourneys() {
  try {
    const response = await fetch(`${API_BASE_URL}/getjourney`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }
}
