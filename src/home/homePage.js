import React, { useState, useEffect } from 'react';
import './home.css'; // Adjust path to your CSS file
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LineGraph from './graph'; // Adjust path to your LineGraph component
import searchIcon from '../images/search.png'; // Adjust path to your image
import { API_ROUTES } from '../app modules/apiRoutes'; // Adjust path to your API_ROUTES
import Navbar from '../componenets/Navbar'; // Adjust path to your Navbar component
import settingsImg from '../images/settings.png'; // Adjust path to your image
import premiumIcon from '../images/premium.png'; // Adjust path to your image
import axios from 'axios';

const HomePage = () => {
  const [user, setUser] = useState({});
  const [joinedEventsCount, setJoinedEventsCount] = useState(0);
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advanceBookings, setAdvanceBookings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event for modal display

  const navigate = useNavigate();
  const pathActive = useLocation();
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_ROUTES.getCustomEvents);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventData = await response.json();
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Handle error fetching events
      }
    };

    const fetchAllEvents = async () => {
      try {
        const response = await fetch(API_ROUTES.fetchEvents);
        if (!response.ok) {
          throw new Error('Failed to fetch all events');
        }
        const eventData = await response.json();
        setAllEvents(eventData);
      } catch (error) {
        console.error('Error fetching all events:', error);
        // Handle error fetching all events
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(API_ROUTES.getAppontments);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await axios.get(API_ROUTES.getAdvanceTickets); // Replace with your API endpoint
        setTickets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching advance tickets:', error);
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');

    const fetchUserDetails = () => {
      fetch(API_ROUTES.fetchUserDetails, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    };

    const fetchUserEventCount = () => {
      fetch(API_ROUTES.getUserEventCount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    };

    const fetchJoinedEventsCount = () => {
      fetch(API_ROUTES.getJoinedEventsCount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setJoinedEventsCount(data.count);
        })
        .catch((error) => {
          console.error('Error fetching joined events count:', error);
        });
    };

    const fetchRegistrationsCount = () => {
      fetch(API_ROUTES.getRegistrationAllEventCount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRegistrationsCount(data.phoneNumberCount);
        })
        .catch((error) => {
          console.error('Error fetching registrations count:', error);
        });
    };

    const fetchEventAttendees = () => {
      fetch(API_ROUTES.getAllEventAllAttendeeData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAdvanceBookings(data);
        })
        .catch((error) => {
          console.error('Error fetching event attendees:', error);
        });
    };

    fetchEvents();
    fetchAllEvents();
    fetchAppointments();
    fetchTickets();
    fetchUserDetails();
    fetchUserEventCount();
    fetchJoinedEventsCount();
    fetchRegistrationsCount();
    fetchEventAttendees();
  }, []);

  useEffect(() => {
    setActiveLink(pathActive.pathname);
  }, [pathActive.pathname]);

  const formatTime = (timeString) => {
    const eventTime = new Date(timeString);
    return eventTime.toLocaleString(); // Adjust locale and options as needed
  };

  const handleChatClick = (phoneNumber) => {
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    window.open(whatsappLink, '_blank');
  };

  const handleViewMessage = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

    // Function to handle navigation and update active link
    const handleNavigation = (path) => {
      navigate(path);
      setActiveLink(path);
    };
  

  return (
    <div className="homepage-container">
      <Navbar activeLink={activeLink} handleNavigation={handleNavigation} user={user} />

      <div className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <div className="search-input-container">
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Dashboard</h2>
          <div className="data-boxes">
            <div className="data-box">
              <h3>Registrations</h3>
              <p>{registrationsCount}</p>
            </div>
            <div className="data-box">
              <h3>Joined Events</h3>
              <p>{joinedEventsCount}</p>
            </div>
            {userData && (
              <div className="data-box">
                <h3>Appointments</h3>
                <p>{userData.phoneNumberCount}</p>
              </div>
            )}
          </div>

          <div className="line-graph">
            <LineGraph />
          </div>

          <div className="footer">
            <div className="advance-bookings">
              <h3>Advance Bookings</h3>
              <ul className="booking-list">
                {tickets.map((ticket, index) => (
                  <li key={index}>
                    <span className="booking-email">{ticket.customer_email}</span>
                    <span className="booking-phone">{ticket.sender_id}</span>
                    <span className="booking-date">{formatTime(ticket.created_at)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="appointments">
              <h3>Appointments</h3>
              <ul className="appointment-list">
                {appointments.map((appointment, index) => (
                  <li key={index}>
                    <span className="appointment-phone">{appointment.phone_number}</span>
                    <span className="appointment-date">{formatTime(appointment.created_at)}</span>
                    <button className="btn-chat" onClick={() => handleChatClick(appointment.phone_number)}>Chat</button>
                  </li>
                ))}
              </ul>
            </div>
            
            
          </div>
          <div className="footer">
            <div className="appointments">
              <h3>Custom Events Enquries</h3>
              <ul className="appointment-list">
                {events.map((event, index) => (
                  <li key={index}>
                    <span className="event-name">{event.sender_id}</span>
                    <span className="event-date">{formatTime(event.created_at)}</span>
                    <button className="btn-chat" onClick={() => handleViewMessage(event)}>View Message</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="appointments">
              <h3>All Events</h3>
              <ul className="appointment-list">
                {allEvents.map((event, index) => (
                  <li key={index}>
                    <span className="appointment-name">{event.event_name}</span>
                    <span className="appointment-date">{formatTime(event.date)}</span>
                    <Link to={`/event/details/${event.id}`}>
                    <button className="btn-chat">View event</button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>


        {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal} style={{cursor: 'pointer'}}>&times;</span>
            <h2>Message from {selectedEvent.sender_id}</h2>
            <p>{selectedEvent.message_body}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;