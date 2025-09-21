import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import StatsCards from '../components/StatsCards';
import TripTable from '../components/TripTable';
import ModeChart from '../components/charts/ModeChart';
import DistanceChart from '../components/charts/DistanceChart';
import { tripData } from '../data/tripData';


const Dashboard = () => {
  

  const [dateRange, setDateRange] = useState('last-30-days');
  const [transportMode, setTransportMode] = useState('all');
  const [region, setRegion] = useState('all-kerala');
  const [dataStatus, setDataStatus] = useState('all');

  const totalTrips = tripData.length;
  const uniqueUsers = new Set(tripData.map(trip => trip.user_id)).size;
  const verifiedPercentage = (tripData.filter(trip => trip.is_verified_by_user).length / totalTrips * 100).toFixed(0);

  return (
    <div>
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

      <StatsCards 
        totalTrips={totalTrips}
        uniqueUsers={uniqueUsers}
        verifiedPercentage={verifiedPercentage}
      />

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
      
      

      <div className="footer">
        <p className="mb-0">&copy; 2025 Government of Kerala, KSCSTE–NATPAC. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Dashboard;