import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './my-event.css';
import { API_ROUTES } from '../app modules/apiRoutes';
import Navbar from '../componenets/Navbar';

const MyEventPage = () => {
  const [activeLink, setActiveLink] = useState('/');
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const pathActive = useLocation();

  // Effect to set active link based on current path
  useEffect(() => {
    setActiveLink(pathActive.pathname);
  }, [pathActive.pathname]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_ROUTES.fetchEvents);
        if (!response.ok) {
          throw new Error('Failed to fetch events.');
        }
        const eventsData = await response.json();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Handle error fetching events
      }
    };

    fetchEvents();
  }, []);

  // Function to deactivate an event
  const handleDeactivate = async (eventId) => {
    try {
      const response = await fetch(`${API_ROUTES.deactivateEvent}/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: 0 }), // Set active to 0 to deactivate
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate event.');
      }

      // Update events list after deactivation
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return { ...event, active: 0 }; // Update the active status locally
        }
        return event;
      });

      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deactivating event:', error);
      // Handle error deactivating event
    }
  };

  // Separate active and inactive events
  const activeEvents = events.filter(event => event.active === '1');
  const inactiveEvents = events.filter(event => event.active === '0');

  const formatTime = (timeString) => {
    const eventTime = new Date(timeString);
    return eventTime.toLocaleString(); // Adjust locale and options as needed
  };

  return (
    <div className="homepage-container">
      <Navbar activeLink={activeLink} handleNavigation={navigate} />
      <div className="my-events-container">
        <h2>Active Events</h2>
        <div className="event-cards">
          {activeEvents.map(event => (
            <div key={event.id} className="event-card">
              <Link to={`/event/details/${event.id}`} style={{textDecoration: 'none', color: 'white'}}>
              <h3>{event.event_name}</h3>
              </Link>
              <button onClick={() => handleDeactivate(event.id)}>Deactivate</button>
            </div>
          ))}
        </div>

        <h2>Inactive Events</h2>
        <div className="event-cards">
          {inactiveEvents.map(event => (
            <div key={event.id} className="event-card inactive">
              <h3>{event.event_name}</h3>
              <p>Date: {formatTime(event.date)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyEventPage;