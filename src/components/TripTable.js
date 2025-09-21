import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const TripTable = ({ tripData }) => {
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
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="card">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Recent Trips</h5>
        <div className="btn-group">
          <Button variant="outline-primary" size="sm">View All</Button>
          <Button variant="outline-secondary" size="sm">Refresh</Button>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>User</th>
                <th>Origin → Destination</th>
                <th>Date & Time</th>
                <th>Mode</th>
                <th>Distance</th>
                <th>Co-travelers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tripData.map(trip => (
                <tr key={trip.trip_id}>
                  <td>{trip.trip_id}</td>
                  <td>{trip.user_id}</td>
                  <td>{trip.origin.name} → {trip.destination.name}</td>
                  <td>{formatDate(trip.start_time)}</td>
                  <td>{getModeBadge(trip.mode)}</td>
                  <td>{trip.distance_travelled} km</td>
                  <td>{trip.co_travellers}</td>
                  <td>{getStatusBadge(trip.is_verified_by_user)}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1">
                      <i className="fas fa-eye"></i>
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="fas fa-download"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TripTable;