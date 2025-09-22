// src/hooks/useJourneyData.js
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useJourneyData = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoading(true);
        const data = await apiService.getJourneys();
        setJourneys(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch journeys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  return { journeys, loading, error };
};