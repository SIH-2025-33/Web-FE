import { useEffect, useState } from "react";

const Trips = () => {
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("https://fastapi-be-htok.onrender.com/get/trips", {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTripData(data); // API response directly replaces hardcoded tripData
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Trips</h2>
      <ul>
        {tripData.map((trip) => (
          <li key={trip.trip_id}>
            {trip.origin.name} → {trip.destination.name} ({trip.mode})
          </li>
        ))}
      </ul>
    </div>
  );
};
export const fetchTrips = async () => {
  try {
    const response = await fetch("https://fastapi-be-htok.onrender.com/get/trips", {
      method: "GET",
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching trips:", err);
    return []; // fallback to empty array
  }
};
export default Trips;
