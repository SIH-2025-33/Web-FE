import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from '../../App';

ChartJS.register(ArcElement, Tooltip, Legend);

const ModeChart = ({ tripData }) => {
  const { isDarkMode } = useContext(ThemeContext);

  // Count trips by mode dynamically
  const modeCounts = tripData.reduce((acc, trip) => {
    const mode = trip.mode || 'Unknown';
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(modeCounts);

  // Dynamically generate colors (reuse base colors or random if more modes)
  const baseColors = ['#0d6efd', '#ffc107', '#dc3545', '#198754', '#6f42c1', '#fd7e14', '#20c997', '#6610f2'];
  const backgroundColor = labels.map((_, idx) => baseColors[idx % baseColors.length]);

  const data = {
    labels,
    datasets: [
      {
        data: Object.values(modeCounts),
        backgroundColor,
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
