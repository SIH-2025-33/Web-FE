import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from '../../App';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const DistanceChart = ({ tripData = [] }) => {
  const { isDarkMode } = useContext(ThemeContext);

  if (!tripData || tripData.length === 0) {
    return <div>Loading chart...</div>;
  }

  // Aggregate distances by transport mode
  const modeStats = tripData.reduce((acc, trip) => {
    const mode = trip.mode || 'Unknown';
    const distance = parseFloat(trip.distance_travelled || 0);

    if (!acc[mode]) acc[mode] = { totalDistance: 0, count: 0 };
    acc[mode].totalDistance += distance;
    acc[mode].count += 1;
    return acc;
  }, {});

  const labels = Object.keys(modeStats);
  const averages = labels.map(mode => (modeStats[mode].totalDistance / modeStats[mode].count).toFixed(2));

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Distance (km)',
        data: averages,
        backgroundColor: ['#0d6efd', '#ffc107', '#dc3545', '#198754', '#6f42c1'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Average Distance by Transport Mode',
        color: isDarkMode ? '#e9ecef' : '#212529',
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: isDarkMode ? '#e9ecef' : '#212529' } },
      x: { ticks: { color: isDarkMode ? '#e9ecef' : '#212529' } },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DistanceChart;
