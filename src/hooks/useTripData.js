import { useState, useEffect } from "react";

const useJourneyData = () => {
  const [journeys, setJourneys] = useState([]); // ✅ initialize with []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const response = await fetch("https://fastapi-be-htok.onrender.com/get/trips", {
          headers: { accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJourneys(data); // ✅ backend trips go here
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  return { journeys, loading, error };
};

export default useJourneyData;
