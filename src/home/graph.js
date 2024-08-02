import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { API_ROUTES } from '../app modules/apiRoutes';

const LineGraph = () => {
  const [registrationData, setRegistrationData] = useState([]);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get(API_ROUTES.getAllRegCountGraph, {
          headers: {
            Authorization: token, // Send token in headers
          },
        });
        setRegistrationData(response.data);
      } catch (error) {
        console.error('Error fetching registration counts:', error);
      }
    };

    fetchRegistrationData();
  }, []);

  // Function to get month name from month index (1 to 12)
  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex - 1];
  };

  // Prepare labels and data for the bar graph
  const labels = Array.from({ length: 12 }, (_, index) => getMonthName(index + 1)); // Labels from 'January' to 'December'
  const dataCounts = Array.from({ length: 12 }, () => 0); // Initial data array, replace with actual counts

  registrationData.forEach(entry => {
    const monthIndex = entry.month; // Month index (1 to 12)
    dataCounts[monthIndex - 1] = entry.count;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Registrations',
        data: dataCounts,
        backgroundColor: '#9d4edd',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        labels,
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bar-graph" style={{marginBottom: '40px'}}>
      <h2>Events</h2>
      <div style={{ height: '600px', width: '800px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;