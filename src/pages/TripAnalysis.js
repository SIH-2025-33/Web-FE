import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Badge } from 'react-bootstrap';

const tripData = [
  {
    "trip_id": 101,
    "user_id": "anon_001",
    "journey_id": 1,
    "origin": { "lat": 9.9312, "lon": 76.2673, "name": "Kochi Home" },
    "destination": { "lat": 10.0184, "lon": 76.3411, "name": "Infopark" },
    "start_time": "2025-09-14T08:05:00",
    "end_time": "2025-09-14T08:55:00",
    "mode": "Bus",
    "distance_travelled": 15.2,
    "co_travellers": 0,
    "is_verified_by_user": true
  },
  {
    "trip_id": 102,
    "user_id": "anon_001",
    "journey_id": 1,
    "origin": { "lat": 10.0184, "lon": 76.3411, "name": "Infopark" },
    "destination": { "lat": 9.9312, "lon": 76.2673, "name": "Kochi Home" },
    "start_time": "2025-09-14T18:10:00",
    "end_time": "2025-09-14T19:05:00",
    "mode": "Bus",
    "distance_travelled": 15.6,
    "co_travellers": 0,
    "is_verified_by_user": true
  },
  {
    "trip_id": 201,
    "user_id": "anon_002",
    "journey_id": 2,
    "origin": { "lat": 9.9896, "lon": 76.2999, "name": "Kaloor" },
    "destination": { "lat": 9.9640, "lon": 76.2825, "name": "Vyttila Hub" },
    "start_time": "2025-09-14T17:30:00",
    "end_time": "2025-09-14T17:55:00",
    "mode": "Auto",
    "distance_travelled": 5.2,
    "co_travellers": 1,
    "is_verified_by_user": false
  }
];

const TripAnalysis = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [transportMode, setTransportMode] = useState('all');
  const [dataStatus, setDataStatus] = useState('all');
  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get/journey', {
      headers: { 'accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => setJourneys(data))
      .catch(err => console.error('Failed to fetch journeys', err));
  }, []);

  const totalTrips = tripData.length;

  const tripsByMode = tripData.reduce((acc, trip) => {
    acc[trip.mode] = (acc[trip.mode] || 0) + 1;
    return acc;
  }, {});

  const getTimeOfDay = (timeString) => {
    const hour = new Date(timeString).getHours();
    if (hour >= 6 && hour < 12) return 'Morning (6AM-12PM)';
    if (hour >= 12 && hour < 17) return 'Afternoon (12PM-5PM)';
    if (hour >= 17 && hour < 21) return 'Evening (5PM-9PM)';
    return 'Night (9PM-6AM)';
  };

  const tripsByTime = tripData.reduce((acc, trip) => {
    const timeCategory = getTimeOfDay(trip.start_time);
    acc[timeCategory] = (acc[timeCategory] || 0) + 1;
    return acc;
  }, {});

  const getStatusBadge = (isVerified) => {
    return isVerified
      ? <Badge bg="success">Verified</Badge>
      : <Badge bg="warning">Unverified</Badge>;
  };

  const getModeBadge = (mode) => {
    const modeStyles = {
      Bus: { bg: "info", text: "white" },
      Auto: { bg: "warning", text: "dark" },
      Car: { bg: "danger", text: "white" },
      Walking: { bg: "success", text: "white" },
      Bicycle: { bg: "primary", text: "white" }
    };

    return (
      <Badge
        bg={modeStyles[mode]?.bg || "secondary"}
        text={modeStyles[mode]?.text}
      >
        {mode}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="filter-bar">
        <Row>
          <Col md={3}>
            <Form.Label>Date Range</Form.Label>
            <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="custom">Custom Range</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Transport Mode</Form.Label>
            <Form.Select value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
              <option value="all">All Modes</option>
              <option value="Bus">Bus</option>
              <option value="Auto">Auto</option>
              <option value="Car">Car</option>
              <option value="Walking">Walking</option>
              <option value="Bicycle">Bicycle</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Region</Form.Label>
            <Form.Select>
              <option value="all-kerala">All Kerala</option>
              <option value="kochi">Kochi</option>
              <option value="thiruvananthapuram">Thiruvananthapuram</option>
              <option value="kozhikode">Kozhikode</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label>Data Status</Form.Label>
            <Form.Select value={dataStatus} onChange={(e) => setDataStatus(e.target.value)}>
              <option value="all">All Data</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Trips by Transport Mode</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '250px' }}>
                <div className="text-center p-4">
                  {Object.keys(tripsByMode).length > 0 ? (
                    <>
                      <div className="d-flex justify-content-around align-items-center">
                        {Object.entries(tripsByMode).map(([mode, count], index) => (
                          <div key={index} className="text-center">
                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                              style={{ width: '60px', height: '60px' }}>
                              <strong>{count}</strong>
                            </div>
                            <div className="mt-2">{mode}</div>
                            <small className="text-muted">{((count / totalTrips) * 100).toFixed(1)}%</small>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                      <p>No trip data available</p>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Trips by Time of Day</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '250px' }}>
                <div className="text-center p-4">
                  {Object.keys(tripsByTime).length > 0 ? (
                    <>
                      <div className="d-flex justify-content-around align-items-center">
                        {Object.entries(tripsByTime).map(([time, count], index) => (
                          <div key={index} className="text-center">
                            <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                              style={{ width: '60px', height: '60px' }}>
                              <strong>{count}</strong>
                            </div>
                            <div className="mt-2">{time.split(' ')[0]}</div>
                            <small className="text-muted">{((count / totalTrips) * 100).toFixed(1)}%</small>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-clock fa-3x text-muted mb-3"></i>
                      <p>No time data available</p>
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Trip Patterns</h5>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <Col md={4}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-user-clock fa-2x text-primary mb-2"></i>
                    <h6>Peak Travel Time</h6>
                    <p className="mb-0">8:00 - 9:00 AM</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-map-marker-alt fa-2x text-success mb-2"></i>
                    <h6>Most Common Origin</h6>
                    <p className="mb-0">Kochi Home</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-flag-checkered fa-2x text-warning mb-2"></i>
                    <h6>Most Common Destination</h6>
                    <p className="mb-0">Infopark</p>
                  </div>
                </Col>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </div>
  );
};

export default TripAnalysis;