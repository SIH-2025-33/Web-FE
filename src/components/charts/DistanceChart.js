// src/components/charts/DistanceChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const DistanceChart = ({ tripData }) => {
  const distanceByMode = tripData.reduce((acc, trip) => {
    if (!acc[trip.mode]) {
      acc[trip.mode] = { total: 0, count: 0 };
    }
    acc[trip.mode].total += trip.distance_travelled;
    acc[trip.mode].count += 1;
    return acc;
  }, {});

  const modes = Object.keys(distanceByMode);
  const avgDistances = modes.map(mode => 
    distanceByMode[mode].total / distanceByMode[mode].count
  );

  const data = {
    labels: modes,
    datasets: [
      {
        label: 'Average Distance (km)',
        data: avgDistances,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Distance (km)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Transport Mode'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Average Distance by Transport Mode'
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default DistanceChart;