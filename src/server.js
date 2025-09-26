// server.js (Backend)
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Sample journey data endpoint
app.get('/api/journeys', async (req, res) => {
  try {
    // Replace this with your actual database query
    const journeys = [
      {
        trip_id: 101,
        user_id: "anon_001",
        journey_id: 1,
        origin: { lat: 9.9312, lon: 76.2673, name: "Kochi Home" },
        destination: { lat: 10.0184, lon: 76.3411, name: "Infopark" },
        start_time: "2025-09-14T08:05:00",
        end_time: "2025-09-14T08:55:00",
        mode: "Bus",
        distance_travelled: 15.2,
        co_travellers: 0,
        is_verified_by_user: true
      }
      // Add more real data here
    ];
    
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json(journeys);
  } catch (error) {
    console.error('Error fetching journeys:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});