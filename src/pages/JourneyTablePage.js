// import React, { useEffect, useState } from 'react';
// import { Table, Alert } from 'react-bootstrap';
// import LoadingSpinner from '../components/LoadingSpinner';

// const JourneyTablePage = () => {
//   const [journeys, setJourneys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchJourneys = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch('https://fastapi-be-htok.onrender.com/get/trips', {
//         headers: { Accept: 'application/json' },
//       });
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);

//       const data = await res.json();
//       const trips = Array.isArray(data) ? data : data.data || [];

//       // Map trips to required fields
//       const normalized = trips.map((t, idx) => ({
//         id: t.trip_id ?? idx,
//         origin: t.origin?.name || 'Unknown',
//         destination: t.destination?.name || 'Unknown',
//         start_time: t.start_time || 'N/A',
//         end_time: t.end_time || 'N/A',
//         purpose: t.purpose || 'N/A',
//         is_verified_by_user: t.is_verified_by_user ?? false,
//       }));

//       setJourneys(normalized);
//     } catch (err) {
//       console.error(err);
//       setError(`Failed to load journeys: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJourneys();
//   }, []);

//   if (loading) return <LoadingSpinner message="Loading journeys..." />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <div>
//       <h3 className="mb-3">All Journeys</h3>
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Origin</th>
//             <th>Destination</th>
//             <th>Start Time</th>
//             <th>End Time</th>
//             <th>Purpose</th>
//             <th>Verified</th>
//           </tr>
//         </thead>
//         <tbody>
//           {journeys.map(j => (
//             <tr key={j.id}>
//               <td>{j.id}</td>
//               <td>{j.origin}</td>
//               <td>{j.destination}</td>
//               <td>{j.start_time}</td>
//               <td>{j.end_time}</td>
//               <td>{j.purpose}</td>
//               <td>{j.is_verified_by_user ? 'Yes' : 'No'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default JourneyTablePage;
import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import '../JourneyTable.css';   // ✅ Import CSS

const JourneyTablePage = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('https://fastapi-be-htok.onrender.com/get/journey', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      const trips = Array.isArray(data) ? data : data.data || [];

      const normalized = trips.map((t, idx) => ({
        id: t.id ?? idx,
        origin: typeof t.origin === 'object'
          ? (t.origin.name || `${t.origin.latitude}, ${t.origin.longitude}`)
          : t.origin || 'Unknown',
        destination: typeof t.destination === 'object'
          ? (t.destination.name || `${t.destination.latitude}, ${t.destination.longitude}`)
          : t.destination || 'Unknown',
        start_time: t.start_time || 'N/A',
        end_time: t.end_time || 'N/A',
        purpose: t.purpose || 'N/A',
        is_verified_by_user: t.is_verified_by_user ?? false,
      }));

      setJourneys(normalized);
    } catch (err) {
      console.error(err);
      setError(`Failed to load journeys: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const handleRowClick = (origin, destination) => {
    if (origin === 'Unknown' || destination === 'Unknown') return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank', 'noopener noreferrer');
  };

  if (loading) return <LoadingSpinner message="Loading journeys..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h3 className="mb-3">All Journeys</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Purpose</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {journeys.map(j => (
            <tr
              key={j.id}
              onClick={() => handleRowClick(j.origin, j.destination)}
              style={{ cursor: (j.origin !== 'Unknown' && j.destination !== 'Unknown') ? 'pointer' : 'default' }}
            >
              <td>{j.id}</td>
              <td>{j.origin}</td>
              <td>{j.destination}</td>
              <td>{j.start_time}</td>
              <td>{j.end_time}</td>
              <td>{j.purpose}</td>
              <td>{j.is_verified_by_user ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default JourneyTablePage;
