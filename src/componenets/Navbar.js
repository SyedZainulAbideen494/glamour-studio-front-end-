import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import dashboardImg from '../images/dashboard.png';
import createEventImg from '../images/create-event.png';
import myeventsImg from '../images/myEvents.png';
import settingsImg from '../images/settings.png';
import './navbar.css';
import { API_ROUTES } from '../app modules/apiRoutes';

const Navbar = ({ activeLink, handleNavigation }) => {
  const [showBookingAppointments, setShowBookingAppointments] = useState(false);
  const [showAdvanceBookings, setShowAdvanceBookings] = useState(false);
  const [showQuarry, setShowQuarry] = useState(false);
  const [bookingAppointments, setBookingAppointments] = useState([]);
  const [advanceBookings, setAdvanceBookings] = useState([]);
  const [quarry, setQuarry] = useState([]);

  useEffect(() => {
    // Fetch booking appointments
    const fetchBookingAppointments = async () => {
      try {
        const response = await fetch(API_ROUTES.getAppointments);
        if (!response.ok) {
          throw new Error('Failed to fetch booking appointments.');
        }
        const appointmentsData = await response.json();
        setBookingAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching booking appointments:', error);
        // Handle error fetching booking appointments
      }
    };

    // Fetch advance bookings
    const fetchAdvanceBookings = async () => {
      try {
        const response = await fetch(API_ROUTES.getAdvanceTickets);
        if (!response.ok) {
          throw new Error('Failed to fetch advance bookings.');
        }
        const bookingsData = await response.json();
        setAdvanceBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching advance bookings:', error);
        // Handle error fetching advance bookings
      }
    };

    // Fetch quarry
    const fetchQuarry = async () => {
      try {
        const response = await fetch(API_ROUTES.getQuarry);
        if (!response.ok) {
          throw new Error('Failed to fetch quarry.');
        }
        const quarryData = await response.json();
        setQuarry(quarryData);
      } catch (error) {
        console.error('Error fetching quarry:', error);
        // Handle error fetching quarry
      }
    };

    fetchBookingAppointments();
    fetchAdvanceBookings();
    fetchQuarry();
  }, []);

  // Toggle booking appointments modal
  const toggleBookingAppointments = () => {
    setShowBookingAppointments(!showBookingAppointments);
    setShowAdvanceBookings(false); // Hide advance bookings when showing booking appointments
    setShowQuarry(false); // Hide quarry when showing booking appointments
  };

  // Toggle advance bookings modal
  const toggleAdvanceBookings = () => {
    setShowAdvanceBookings(!showAdvanceBookings);
    setShowBookingAppointments(false); // Hide booking appointments when showing advance bookings
    setShowQuarry(false); // Hide quarry when showing advance bookings
  };

  // Toggle quarry modal
  const toggleQuarry = () => {
    setShowQuarry(!showQuarry);
    setShowBookingAppointments(false); // Hide booking appointments when showing quarry
    setShowAdvanceBookings(false); // Hide advance bookings when showing quarry
  };

  const formatTime = (timeString) => {
    const eventTime = new Date(timeString);
    return eventTime.toLocaleString(); // Adjust locale and options as needed
  };

  return (
    <div className="left-nav">
      <h1 className="app-name">Amute</h1>
      <div className="nav-buttons">
        <button
          className={`nav-btn ${activeLink === '/dashboard' && 'active-nav-btn'}`}
          onClick={() => handleNavigation('/dashboard')}
        >
          <img src={dashboardImg} alt="Dashboard" className="nav-icon" />
          Dashboard
        </button>
        <button
          className={`nav-btn ${activeLink === '/create-event' && 'active-nav-btn'}`}
          onClick={() => handleNavigation('/create-event')}
        >
          <img src={createEventImg} alt="Create Event" className="nav-icon" />
          Create Event
        </button>
        <button
          className={`nav-btn ${activeLink === '/my/events' && 'active-nav-btn'}`}
          onClick={() => handleNavigation('/my/events')}
        >
          <img src={myeventsImg} alt="My Events" className="nav-icon" />
          My Events
        </button>
        <button className="nav-btn" onClick={toggleBookingAppointments}>
          <img src={myeventsImg} alt="Appointments" className="nav-icon" />
          Appointments
          {showBookingAppointments && (
            <div className="notification-modal">
              <h3>Booking Appointments</h3>
              <ul>
                {bookingAppointments.map(appointment => (
                  <li key={appointment.id}>
                    <strong>{appointment.phone_number}</strong> - {formatTime(appointment.created_at)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </button>
        <button className="nav-btn" onClick={toggleAdvanceBookings}>
          <img src={myeventsImg} alt="Advance Bookings" className="nav-icon" />
          Advance Bookings
          {showAdvanceBookings && (
            <div className="notification-modal">
              <h3>Advance Bookings</h3>
              <ul>
                {advanceBookings.map(booking => (
                  <li key={booking.id}>
                    <strong>{booking.sender_id}</strong> - {formatTime(booking.created_at)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </button>
        <button className="nav-btn" onClick={toggleQuarry}>
          <img src={myeventsImg} alt="Quarry" className="nav-icon" />
          Quarry
          {showQuarry && (
            <div className="notification-modal">
              <h3>Quarry</h3>
              <ul>
                {quarry.map(item => (
                  <li key={item.id}>
                    <strong>{item.sender_id} - {item.conversation_type}</strong> - {formatTime(item.created_at)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
