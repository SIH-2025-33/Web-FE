import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip } from 'react-leaflet';
import { tripData } from '../data/tripData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



const GeographicData = () => {
  const [selectedRegion, setSelectedRegion] = useState('all-kerala');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [transportMode, setTransportMode] = useState('all');
  const [mapCenter, setMapCenter] = useState([10.1632, 76.6413]); 
  const [mapZoom, setMapZoom] = useState(8);

  const calculateRouteFrequencies = () => {
  const routeCounts = {};
  
  tripData.forEach(trip => {
    if (!trip || !trip.origin || !trip.destination) return; 
    
    const routeKey = `${trip.origin.name}-${trip.destination.name}`;
    const reverseRouteKey = `${trip.destination.name}-${trip.origin.name}`;
    
    if (routeCounts[routeKey]) {
      routeCounts[routeKey].count += 1;
    } else if (routeCounts[reverseRouteKey]) {
      routeCounts[reverseRouteKey].count += 1;
    } else {
      routeCounts[routeKey] = {
        from: trip.origin.name,
        to: trip.destination.name,
        count: 1,
        mode: trip.mode,
        distance: trip.distance_travelled,
        origin: trip.origin,
        destination: trip.destination,
        coordinates: [
          [trip.origin.lat, trip.origin.lon],
          [trip.destination.lat, trip.destination.lon]
        ]
      };
    }
  });
  
  return Object.values(routeCounts);
};

  const routeFrequencies = calculateRouteFrequencies();

  const calculateIntensity = (count) => {
    const maxTrips = Math.max(...routeFrequencies.map(route => route.count));
    return Math.round((count / maxTrips) * 100);
  };

  const getIntensityColor = (intensity) => {
    if (intensity >= 70) return 'red';
    if (intensity >= 40) return 'orange';
    return 'green';
  };

  const getColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-danger';
      case 'orange': return 'bg-warning';
      case 'green': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const filteredRoutes = routeFrequencies.filter(route => {
    if (transportMode !== 'all' && route.mode !== transportMode) {
      return false;
    }
    return true;
  });

  const totalRoutes = filteredRoutes.length;
  const totalTrips = filteredRoutes.reduce((sum, route) => sum + route.count, 0);
  const avgTripsPerRoute = totalRoutes > 0 ? (totalTrips / totalRoutes).toFixed(1) : 0;

  const topRoutes = [...filteredRoutes]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const createCustomIcon = (color) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <div>
      <div className="filter-bar mb-4">
        <Row>
          <Col md={4}>
            <Form.Label>Region</Form.Label>
            <Form.Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              <option value="all-kerala">All Kerala</option>
              <option value="kochi">Kochi Region</option>
              <option value="thiruvananthapuram">Thiruvananthapuram</option>
              <option value="kozhikode">Kozhikode</option>
              <option value="thrissur">Thrissur</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Time Period</Form.Label>
            <Form.Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="all-time">All Time</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label>Transport Mode</Form.Label>
            <Form.Select value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
              <option value="all">All Modes</option>
              <option value="Bus">Bus</option>
              <option value="Auto">Auto</option>
              <option value="Car">Car</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Kerala Route Heat Map</h5>
              <p className="text-muted mb-0">Based on {totalTrips} trips across {totalRoutes} routes</p>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ height: '500px' }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {filteredRoutes.map((route, index) => {
                    const intensity = calculateIntensity(route.count);
                    const color = getIntensityColor(intensity);

                    let lineColor;
                    if (color === 'red') lineColor = '#ff0000';
                    else if (color === 'orange') lineColor = '#ffa500';
                    else if (color === 'green') lineColor = '#008000';

                    return (
                      <div key={index}>
                        <Polyline
                          positions={route.coordinates}
                          color={lineColor}
                          weight={4}
                          opacity={0.7}
                        >
                        </Polyline>

                        
                      </div>
                    );
                  })}


                </MapContainer>
              </div>

              <div className="p-3 border-top">
                <h6>Route Intensity Legend:</h6>
                <div className="d-flex gap-3 mb-2">
                  <span className="badge bg-danger">High Traffic (≥70%)</span>
                  <span className="badge bg-warning">Medium Traffic (40-69%)</span>
                  <span className="badge bg-success">Low Traffic (&lt;40%)</span>
                </div>
                <small className="text-muted">Click on routes to see details</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Route Statistics</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6>Top Routes by Usage</h6>
                {topRoutes.map((route, index) => {
                  const intensity = calculateIntensity(route.count);
                  const color = getIntensityColor(intensity);

                  return (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                      <div>
                        <span className="me-2">{index + 1}.</span>
                        {route.from} → {route.to}
                      </div>
                      <span className={`badge ${getColorClass(color)}`}>
                        {route.count} trip{route.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}

                {topRoutes.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-muted">No route data available</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h6>Traffic Distribution</h6>
                {filteredRoutes.length > 0 ? (
                  <>
                    <div className="d-flex align-items-center mb-2">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <span>High Traffic (&gt;= 70%)</span>
                          <span>
                            {filteredRoutes.filter(route => calculateIntensity(route.count) >= 70).length}
                          </span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-danger"
                            style={{
                              width: `${(filteredRoutes.filter(route => calculateIntensity(route.count) >= 70).length / filteredRoutes.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <span>Medium Traffic (40-69%)</span>
                          <span>
                            {filteredRoutes.filter(route => calculateIntensity(route.count) >= 40 && calculateIntensity(route.count) < 70).length}
                          </span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-warning"
                            style={{
                              width: `${(filteredRoutes.filter(route => calculateIntensity(route.count) >= 40 && calculateIntensity(route.count) < 70).length / filteredRoutes.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <span>Low Traffic (&lt; 40%)</span>
                          <span>
                            {filteredRoutes.filter(route => calculateIntensity(route.count) < 40).length}
                          </span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-success"
                            style={{
                              width: `${(filteredRoutes.filter(route => calculateIntensity(route.count) < 40).length / filteredRoutes.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted">No traffic data available</p>
                  </div>
                )}
              </div>

              <div>
                <h6>Quick Facts</h6>
                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Routes:</span>
                    <strong>{totalRoutes}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Trips:</span>
                    <strong>{totalTrips}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Avg Trips/Route:</span>
                    <strong>{avgTripsPerRoute}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Most Popular Mode:</span>
                    <strong>
                      {filteredRoutes.length > 0
                        ? [...new Set(filteredRoutes.map(route => route.mode))].join(', ')
                        : 'N/A'
                      }
                    </strong>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Transport Mode Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '300px' }}>
                <div className="text-center p-4">
                  <i className="fas fa-bus fa-3x text-info mb-3"></i>
                  <h6>Trips by Transport Mode</h6>
                  <div className="d-flex justify-content-around mt-3">
                    {filteredRoutes.length > 0 ? (
                      [...new Set(filteredRoutes.map(route => route.mode))].map((mode, index) => {
                        const modeCount = filteredRoutes.filter(route => route.mode === mode).length;
                        const percentage = Math.round((modeCount / filteredRoutes.length) * 100);

                        return (
                          <div key={index} className="text-center">
                            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px' }}>
                              <strong>{percentage}%</strong>
                            </div>
                            <div>{mode}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center w-100">
                        <p className="text-muted">No mode data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="card-title mb-0">Route Recommendations</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container" style={{ height: '300px' }}>
                <div className="text-center p-4">
                  <i className="fas fa-lightbulb fa-3x text-warning mb-3"></i>
                  <h6>Optimization Suggestions</h6>
                  <div className="text-start mt-3">
                    {topRoutes.slice(0, 2).map((route, index) => (
                      <div key={index} className="alert alert-info py-2 mb-2">
                        <i className="fas fa-info-circle me-2"></i>
                        Add more {route.mode}s on {route.from} → {route.to} route
                        ({route.count} trips)
                      </div>
                    ))}
                    <div className="alert alert-success py-2 mb-2">
                      <i className="fas fa-check-circle me-2"></i>
                      Consider alternative routes during peak hours
                    </div>
                    <div className="alert alert-warning py-2">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Monitor traffic patterns for optimization opportunities
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GeographicData;