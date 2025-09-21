import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from '../../App';

ChartJS.register(ArcElement, Tooltip, Legend);

const ModeChart = ({ tripData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const modeCounts = tripData.reduce((acc, trip) => {
    acc[trip.mode] = (acc[trip.mode] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(modeCounts),
    datasets: [
      {
        data: Object.values(modeCounts),
        backgroundColor: [
          '#0d6efd', // Bus - blue
          '#ffc107', // Auto - yellow
          '#dc3545', // Car - red
          '#198754', // Walking - green
          '#6f42c1'  // Bicycle - purple
        ],
        borderWidth: 1,
        borderColor: isDarkMode ? '#495057' : '#fff'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#e9ecef' : '#212529'
        }
      },
      title: {
        display: true,
        text: 'Transport Mode Distribution',
        color: isDarkMode ? '#e9ecef' : '#212529'
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};

export default ModeChart;