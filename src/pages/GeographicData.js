import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Button, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import Navbar from '../components/Navbar'; // Adjust path based on your folder structure

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Sample fallback data
const sampleTripData = [
  {
    trip_id: 101,
    user_id: "anon_001",
    journey_id: 1,
    origin: { latitude: 9.9312, longitude: 76.2673, name: "Kochi Home" },
    destination: { latitude: 10.0184, longitude: 76.3411, name: "Infopark" },
    start_time: "2025-09-14T08:05:00",
    end_time: "2025-09-14T08:55:00",
    mode: "Bus",
    distance_travelled: 15.2,
    co_travellers: 0,
    is_verified_by_user: true
  }
];

// Normalize backend trips
const normalizeTrips = (data) =>
  data.map((t, index) => ({
    trip_id: t.trip_id || index,
    user_id: t.user_id || `anon_${index}`,
    journey_id: t.journey_id || null,
    origin: {
      lat: t.origin?.latitude,
      lon: t.origin?.longitude,
      name: t.origin?.name || "Unknown Origin"
    },
    destination: {
      lat: t.destination?.latitude,
      lon: t.destination?.longitude,
      name: t.destination?.name || "Unknown Destination"
    },
    start_time: t.start_time,
    end_time: t.end_time,
    mode: t.mode || "Unknown",
    distance_travelled: t.distance_travelled || 0,
    co_travellers: t.co_travellers || 0,
    is_verified_by_user: t.is_verified_by_user ?? false
  }));

// Filter trips
const filterTripData = (data, transportMode, timeFilter, selectedRegion) => {
  if (!Array.isArray(data)) return [];
  const now = new Date();
  let timeLimit = new Date(0);

  switch (timeFilter) {
    case 'last-week': timeLimit = new Date(now.setDate(now.getDate() - 7)); break;
    case 'last-month': timeLimit = new Date(now.setMonth(now.getMonth() - 1)); break;
    case 'last-quarter': timeLimit = new Date(now.setMonth(now.getMonth() - 3)); break;
    default: timeLimit = new Date(0);
  }

  return data.filter(trip => {
    if (!trip?.origin || !trip?.destination) return false;
    if (transportMode !== 'all' && trip.mode !== transportMode) return false;
    if (new Date(trip.start_time) < timeLimit) return false;

    if (selectedRegion !== 'all-kerala') {
      const regions = {
        kochi: { lat: [9.8, 10.2], lon: [76.1, 76.5] },
        thiruvananthapuram: { lat: [8.3, 8.7], lon: [76.8, 77.1] },
        kozhikode: { lat: [11.1, 11.5], lon: [75.7, 76.0] },
        thrissur: { lat: [10.4, 10.8], lon: [76.0, 76.4] }
      };
      const r = regions[selectedRegion];
      if (r) {
        const inLat = trip.origin.lat >= r.lat[0] && trip.origin.lat <= r.lat[1];
        const inLon = trip.origin.lon >= r.lon[0] && trip.origin.lon <= r.lon[1];
        if (!inLat || !inLon) return false;
      }
    }

    return true;
  });
};

// Create routes for polyline
const getPolylineRoutes = (filteredData) =>
  filteredData.map((trip, idx) => ({
    id: trip.trip_id || idx,
    coordinates: [
      [trip.origin.lat, trip.origin.lon],
      [trip.destination.lat, trip.destination.lon]
    ],
    tripData: trip
  }));

// Color based on mode
const getRouteColor = (mode) => ({
  Bus: '#2196f3',
  Train: '#4caf50',
  Auto: '#ff9800',
  Car: '#f44336'
}[mode] || '#9c27b0');

const GeographicData = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all-kerala');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [transportMode, setTransportMode] = useState('all');
const [mapCenter] = useState([12.9141, 74.8560]);
  const [mapZoom] = useState(8);

  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://fastapi-be-htok.onrender.com/get/trips", {
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const rawData = await response.json();
      const trips = Array.isArray(rawData) ? rawData : rawData.data || [];
      const cleaned = normalizeTrips(trips).filter(
        t => t.origin.lat && t.origin.lon && t.destination.lat && t.destination.lon
      );
      if (cleaned.length === 0) {
        setJourneys(sampleTripData);
        setError("No valid trips from server. Showing sample data.");
      } else setJourneys(cleaned);
    } catch (err) {
      console.error("Error fetching journey data:", err);
      setError(`Connection error: ${err.message}. Using sample data.`);
      setJourneys(sampleTripData);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchJourneyData(); }, []);

  const filteredData = filterTripData(journeys, transportMode, timeFilter, selectedRegion);
  const routes = getPolylineRoutes(filteredData);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-2">Loading journey data...</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Filters */}
      <div className="filter-bar mb-4">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Label><strong>Region</strong></Form.Label>
            <Form.Select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
              <option value="all-kerala">All Kerala</option>
              <option value="kochi">Kochi</option>
              <option value="thiruvananthapuram">Thiruvananthapuram</option>
              <option value="kozhikode">Kozhikode</option>
              <option value="thrissur">Thrissur</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label><strong>Time Period</strong></Form.Label>
            <Form.Select value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
              <option value="all-time">All Time</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label><strong>Transport Mode</strong></Form.Label>
            <Form.Select value={transportMode} onChange={e => setTransportMode(e.target.value)}>
              <option value="all">All Modes</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Auto">Auto</option>
              <option value="Car">Car</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="outline-primary" onClick={fetchJourneyData} disabled={loading} className="w-100">
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="warning" className="mb-3">{error}</Alert>}

      {/* Map */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Kerala Route Map</h5>
          <small className="text-muted">Showing {filteredData.length} of {journeys.length} routes</small>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <div style={{ height: '500px' }}>
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {routes.map(route => (
                <Polyline key={route.id} positions={route.coordinates} color={getRouteColor(route.tripData.mode)} weight={4} opacity={0.7} />
              ))}
            </MapContainer>
          </div>
        </Card.Body>
      </Card>

      {/* Open Chatbot Button */}
      <Button
        onClick={() => window.open('https://mysimplechatbot-appgit-2hgxq4jkr9vkdwejqqhyuw.streamlit.app/', '_blank')}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          padding: '0',
          fontSize: '24px',
          zIndex: 1050,
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        }}
        title="Open Chatbot"
      >
        💬
      </Button>
    </div>
  );
};

export default GeographicData;
