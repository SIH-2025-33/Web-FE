import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import StatsCards from '../components/StatsCards';
import TripTable from '../components/TripTable';
import ModeChart from '../components/charts/ModeChart';
import DistanceChart from '../components/charts/DistanceChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { ThemeContext } from '../App';
import '../App.css';

// Backend API
const API_URL = "https://fastapi-be-htok.onrender.com/get/trips";

// Normalize backend trips
const normalizeTrips = (trips) =>
  trips.map((t, idx) => ({
    trip_id: t.trip_id || idx,
    user_id: t.user_id || `anon_${idx}`,
    origin: { lat: t.origin?.latitude || t.origin?.lat, lon: t.origin?.longitude || t.origin?.lon, name: t.origin?.name || "Unknown" },
    destination: { lat: t.destination?.latitude || t.destination?.lat, lon: t.destination?.longitude || t.destination?.lon, name: t.destination?.name || "Unknown" },
    mode: t.mode || "Unknown",
    distance_travelled: t.distance_travelled || 0,
    co_travellers: t.co_travellers || 0,
    is_verified_by_user: t.is_verified_by_user ?? false,
    start_time: t.start_time,
    end_time: t.end_time
  }));

const Dashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  const fetchJourneys = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      const data = await res.json();
      const trips = Array.isArray(data) ? data : data.data || [];
      setJourneys(normalizeTrips(trips));
    } catch (err) {
      console.error(err);
      setError(err.message);
      setJourneys([]); // fallback empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const totalTrips = journeys.length;
  const uniqueUsers = new Set(journeys.map(t => t.user_id)).size;
  const verifiedPercentage = journeys.length > 0
    ? (journeys.filter(t => t.is_verified_by_user).length / totalTrips * 100).toFixed(0)
    : 0;

  if (loading) return <LoadingSpinner message="Loading journey data..." />;

  if (error) {
    return (
      <Alert variant="warning" className="m-3">
        <Alert.Heading>Connection Issue</Alert.Heading>
        <p>{error}. Showing empty dashboard.</p>
      </Alert>
    );
  }

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`} style={{ padding: '20px' }}>
      <StatsCards totalTrips={totalTrips} uniqueUsers={uniqueUsers} verifiedPercentage={verifiedPercentage} />

      <Row className="mb-4 mt-4">
        <Col md={6}>
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Transport Mode Distribution</h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
              <ModeChart tripData={journeys} />
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Average Distance by Mode</h5>
            </div>
            <div className="card-body" style={{ height: '400px' }}>
              <DistanceChart tripData={journeys} />
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Journey Table</h5>
            </div>
            <div className="card-body">
              <TripTable tripData={journeys} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
