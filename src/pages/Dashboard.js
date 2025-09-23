// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import StatsCards from '../components/StatsCards';
import TripTable from '../components/TripTable';
import ModeChart from '../components/charts/ModeChart';
import DistanceChart from '../components/charts/DistanceChart'; // This file doesn't exist!
import { useJourneyData } from '../hooks/useJourneyData';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleTripData = [
  {
    "trip_id": 101,
    "user_id": "anon_001",
    "journey_id": 1,
    "origin": {"lat": 9.9312, "lon": 76.2673, "name": "Kochi Home"},
    "destination": {"lat": 10.0184, "lon": 76.3411, "name": "Infopark"},
    "start_time": "2025-09-14T08:05:00",
    "end_time": "2025-09-14T08:55:00",
    "mode": "Bus",
    "distance_travelled": 15.2,
    "co_travellers": 0,
    "is_verified_by_user": true
  },
];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [transportMode, setTransportMode] = useState('all');
  const [region, setRegion] = useState('all-kerala');
  const [dataStatus, setDataStatus] = useState('all');
  
  // Use the custom hook to fetch data
  const { journeys, loading, error } = useJourneyData();
  
  // Use real data if available, otherwise fallback to sample data
  const tripData = journeys.length > 0 ? journeys : sampleTripData;

  // Calculate stats for the cards
  const totalTrips = tripData.length;
  const uniqueUsers = new Set(tripData.map(trip => trip.user_id)).size;
  const verifiedPercentage = tripData.length > 0 
    ? (tripData.filter(trip => trip.is_verified_by_user).length / totalTrips * 100).toFixed(0)
    : 0;

  if (loading) {
    return <LoadingSpinner message="Loading journey data..." />;
  }

  if (error) {
    return (
      <div>
        <Alert variant="warning">
          <Alert.Heading>Connection Issue</Alert.Heading>
          <p>Unable to connect to the server. Showing sample data instead.</p>
          <p className="mb-0"><small>Error: {error}</small></p>
        </Alert>
        
        <DashboardContent 
          tripData={tripData}
          totalTrips={totalTrips}
          uniqueUsers={uniqueUsers}
          verifiedPercentage={verifiedPercentage}
          dateRange={dateRange}
          setDateRange={setDateRange}
          transportMode={transportMode}
          setTransportMode={setTransportMode}
          region={region}
          setRegion={setRegion}
          dataStatus={dataStatus}
          setDataStatus={setDataStatus}
        />
      </div>
    );
  }

  return (
    <DashboardContent 
      tripData={tripData}
      totalTrips={totalTrips}
      uniqueUsers={uniqueUsers}
      verifiedPercentage={verifiedPercentage}
      dateRange={dateRange}
      setDateRange={setDateRange}
      transportMode={transportMode}
      setTransportMode={setTransportMode}
      region={region}
      setRegion={setRegion}
      dataStatus={dataStatus}
      setDataStatus={setDataStatus}
    />
  );
};

// Separate component for the main dashboard content
const DashboardContent = ({ 
  tripData, 
  totalTrips, 
  uniqueUsers, 
  verifiedPercentage, 
  dateRange, 
  setDateRange, 
  transportMode, 
  setTransportMode, 
  region, 
  setRegion, 
  dataStatus, 
  setDataStatus 
}) => {
  return (
    <div>
      {/* Filter Bar */}
      <div className="filter-bar">
        <Row>
          <Col md={3} className="mb-2">
            <Form.Label>Date Range</Form.Label>
            <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="custom">Custom Range</option>
            </Form.Select>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Label>Transport Mode</Form.Label>
            <Form.Select value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
              <option value="all">All Modes</option>
              <option value="bus">Bus</option>
              <option value="auto">Auto</option>
              <option value="car">Car</option>
              <option value="walking">Walking</option>
              <option value="bicycle">Bicycle</option>
            </Form.Select>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Label>Region</Form.Label>
            <Form.Select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all-kerala">All Kerala</option>
              <option value="thiruvananthapuram">Thiruvananthapuram</option>
              <option value="kochi">Kochi</option>
              <option value="kozhikode">Kozhikode</option>
              <option value="thrissur">Thrissur</option>
            </Form.Select>
          </Col>
          <Col md={3} className="mb-2">
            <Form.Label>Data Status</Form.Label>
            <Form.Select value={dataStatus} onChange={(e) => setDataStatus(e.target.value)}>
              <option value="all">All Data</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        totalTrips={totalTrips}
        uniqueUsers={uniqueUsers}
        verifiedPercentage={verifiedPercentage}
      />

      {/* Charts Row */}
      <Row>
        <Col md={6}>
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Transport Mode Distribution</h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ModeChart tripData={tripData} />
              </div>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Average Distance by Mode</h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <DistanceChart tripData={tripData} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Data Table */}
      <Row>
        <Col xs={12}>
          <TripTable tripData={tripData} />
        </Col>
      </Row>

      {/* Footer */}
      <div className="footer">
        <p className="mb-0">&copy; 2025 Government of Kerala, KSCSTE–NATPAC. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Dashboard;