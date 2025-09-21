import React, { useState } from 'react';
import { Row, Col, Form, Card, Table, Badge, ProgressBar } from 'react-bootstrap';

const getUserData = () => {
  const userTripCounts = {};
  const userTotalDistance = {};
  const userModes = {};
  
  const tripData = [
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
    {
      "trip_id": 102,
      "user_id": "anon_001",
      "journey_id": 1,
      "origin": {"lat": 10.0184, "lon": 76.3411, "name": "Infopark"},
      "destination": {"lat": 9.9312, "lon": 76.2673, "name": "Kochi Home"},
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
      "origin": {"lat": 9.9896, "lon": 76.2999, "name": "Kaloor"},
      "destination": {"lat": 9.9640, "lon": 76.2825, "name": "Vyttila Hub"},
      "start_time": "2025-09-14T17:30:00",
      "end_time": "2025-09-14T17:55:00",
      "mode": "Auto",
      "distance_travelled": 5.2,
      "co_travellers": 1,
      "is_verified_by_user": false
    }
  ];

  tripData.forEach(trip => {
    if (!userTripCounts[trip.user_id]) {
      userTripCounts[trip.user_id] = 0;
      userTotalDistance[trip.user_id] = 0;
      userModes[trip.user_id] = new Set();
    }
    
    userTripCounts[trip.user_id] += 1;
    userTotalDistance[trip.user_id] += trip.distance_travelled;
    userModes[trip.user_id].add(trip.mode);
  });

  return Object.keys(userTripCounts).map(userId => {
    const tripCount = userTripCounts[userId];
    const totalDistance = userTotalDistance[userId];
    const avgDistance = totalDistance / tripCount;
    const modes = Array.from(userModes[userId]);
    
    return {
      id: userId,
      tripCount,
      totalDistance,
      avgDistance,
      modes,
      joinedDate: "2025-09-01",
      lastActive: "2025-09-14",
      status: "active"
    };
  });
};

const userData = getUserData();

const UserStatistics = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [userStatus, setUserStatus] = useState('all');
  const [sortField, setSortField] = useState('tripCount');
  const [sortOrder, setSortOrder] = useState('desc');

  const totalUsers = userData.length;
  const totalTrips = userData.reduce((sum, user) => sum + user.tripCount, 0);
  const avgTripsPerUser = totalUsers > 0 ? (totalTrips / totalUsers).toFixed(1) : 0;
  const totalDistance = userData.reduce((sum, user) => sum + user.totalDistance, 0);
  const avgDistancePerUser = totalUsers > 0 ? (totalDistance / totalUsers).toFixed(1) : 0;

  const sortedUsers = [...userData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'modes') {
      aValue = a.modes.length;
      bValue = b.modes.length;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getStatusBadge = (status) => {
    return status === "active" 
      ? <Badge bg="success">Active</Badge>
      : <Badge bg="secondary">Inactive</Badge>;
  };

  const getModeBadges = (modes) => {
    return modes.map((mode, index) => {
      const modeStyles = {
        Bus: { bg: "info", text: "white" },
        Auto: { bg: "warning", text: "dark" },
        Car: { bg: "danger", text: "white" },
        Walking: { bg: "success", text: "white" },
        Bicycle: { bg: "primary", text: "white" }
      };
      
      return (
        <Badge 
          key={index}
          bg={modeStyles[mode]?.bg || "secondary"} 
          text={modeStyles[mode]?.text}
          className="me-1"
        >
          {mode}
        </Badge>
      );
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <div className="filter-bar">
        <Row>
          <Col md={4}>
            <Form.Label>Date Range</Form.Label>
            <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-3-months">Last 3 months</option>
              <option value="all-time">All Time</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>User Status</Form.Label>
            <Form.Select value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Region</Form.Label>
            <Form.Select>
              <option value="all-kerala">All Kerala</option>
              <option value="kochi">Kochi</option>
              <option value="thiruvananthapuram">Thiruvananthapuram</option>
              <option value="kozhikode">Kozhikode</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="text-primary">
                <i className="fas fa-users fa-3x"></i>
              </div>
              <div className="number">{totalUsers}</div>
              <div className="label">Total Users</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="text-success">
                <i className="fas fa-route fa-3x"></i>
              </div>
              <div className="number">{totalTrips}</div>
              <div className="label">Total Trips</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="text-info">
                <i className="fas fa-road fa-3x"></i>
              </div>
              <div className="number">{totalDistance.toFixed(1)} km</div>
              <div className="label">Total Distance</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="text-warning">
                <i className="fas fa-chart-line fa-3x"></i>
              </div>
              <div className="number">{avgTripsPerUser}</div>
              <div className="label">Avg Trips/User</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">User Activity Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '250px' }}>
                <div className="text-center p-4">
                  <div className="d-flex justify-content-around align-items-center">
                    <div className="text-center">
                      <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                          style={{ width: '70px', height: '70px' }}>
                        <strong>100%</strong>
                      </div>
                      <div className="mt-2">Active Users</div>
                      <small className="text-muted">{totalUsers} users</small>
                    </div>
                    <div className="text-center">
                      <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                          style={{ width: '70px', height: '70px' }}>
                        <strong>0%</strong>
                      </div>
                      <div className="mt-2">Inactive Users</div>
                      <small className="text-muted">0 users</small>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Top Travelers</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '250px' }}>
                <div className="text-center p-3">
                  {sortedUsers.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                            style={{ width: '40px', height: '40px' }}>
                          {index + 1}
                        </div>
                        <div>
                          <div>{user.id}</div>
                          <small className="text-muted">{user.tripCount} trips</small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">{user.totalDistance.toFixed(1)} km</div>
                        <small className="text-muted">total distance</small>
                      </div>
                    </div>
                  ))}
                  
                  {sortedUsers.length === 0 && (
                    <div className="text-center py-4">
                      <i className="fas fa-user fa-3x text-muted mb-3"></i>
                      <p>No user data available</p>
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
              <h5 className="card-title mb-0">User Engagement Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <Col md={3}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-calendar-check fa-2x text-primary mb-2"></i>
                    <h6>Average Trips per User</h6>
                    <p className="mb-0 fs-4">{avgTripsPerUser}</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-road fa-2x text-success mb-2"></i>
                    <h6>Average Distance per User</h6>
                    <p className="mb-0 fs-4">{avgDistancePerUser} km</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-bus fa-2x text-info mb-2"></i>
                    <h6>Most Common Mode</h6>
                    <p className="mb-0">Bus</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 border rounded">
                    <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                    <h6>Average Trip Duration</h6>
                    <p className="mb-0">45 min</p>
                  </div>
                </Col>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">User Details</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                        User ID {getSortIndicator('id')}
                      </th>
                      <th onClick={() => handleSort('tripCount')} style={{ cursor: 'pointer' }}>
                        Trips {getSortIndicator('tripCount')}
                      </th>
                      <th onClick={() => handleSort('totalDistance')} style={{ cursor: 'pointer' }}>
                        Total Distance {getSortIndicator('totalDistance')}
                      </th>
                      <th onClick={() => handleSort('avgDistance')} style={{ cursor: 'pointer' }}>
                        Avg. Distance {getSortIndicator('avgDistance')}
                      </th>
                      <th onClick={() => handleSort('modes')} style={{ cursor: 'pointer' }}>
                        Transport Modes {getSortIndicator('modes')}
                      </th>
                      <th>Joined Date</th>
                      <th>Last Active</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="me-2">{user.tripCount}</span>
                            <ProgressBar 
                              now={(user.tripCount / Math.max(...sortedUsers.map(u => u.tripCount))) * 100} 
                              style={{ width: '100px', height: '8px' }} 
                            />
                          </div>
                        </td>
                        <td>{user.totalDistance.toFixed(1)} km</td>
                        <td>{user.avgDistance.toFixed(1)} km</td>
                        <td>{getModeBadges(user.modes)}</td>
                        <td>{user.joinedDate}</td>
                        <td>{user.lastActive}</td>
                        <td>{getStatusBadge(user.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserStatistics;