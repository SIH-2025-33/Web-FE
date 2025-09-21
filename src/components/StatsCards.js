import React from 'react';
import { Row, Col } from 'react-bootstrap';

const StatsCards = ({ totalTrips, uniqueUsers, verifiedPercentage }) => {
  return (
    <Row>
      <Col md={4}>
        <div className="card stat-card">
          <div className="card-body">
            <div className="text-primary">
              <i className="fas fa-route fa-3x"></i>
            </div>
            <div className="number">{totalTrips}</div>
            <div className="label">Total Trips Recorded</div>
          </div>
        </div>
      </Col>
      <Col md={4}>
        <div className="card stat-card">
          <div className="card-body">
            <div className="text-info">
              <i className="fas fa-users fa-3x"></i>
            </div>
            <div className="number">{uniqueUsers}</div>
            <div className="label">Active Users</div>
          </div>
        </div>
      </Col>
      <Col md={4}>
        <div className="card stat-card">
          <div className="card-body">
            <div className="text-warning">
              <i className="fas fa-check-circle fa-3x"></i>
            </div>
            <div className="number">{verifiedPercentage}%</div>
            <div className="label">Verified Data</div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default StatsCards;