import React from 'react';

const TripMap = ({ tripData }) => {
  return (
    <div className="map-placeholder">
      <div>
        <i className="fas fa-map-marked-alt fa-3x mb-3"></i>
        <p>Interactive Map View</p>
        <p className="small mb-3">Showing {tripData.length} trips</p>
        <div className="text-start">
          <h6>Trip Origins:</h6>
          <ul>
            {tripData.map(trip => (
              <li key={trip.trip_id}>{trip.origin.name}</li>
            ))}
          </ul>
          <h6>Trip Destinations:</h6>
          <ul>
            {tripData.map(trip => (
              <li key={trip.trip_id}>{trip.destination.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TripMap;