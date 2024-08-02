import React, { useState, useEffect } from 'react';
import './eventdetails.css'; // Import your CSS file for styling
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { API_ROUTES } from '../app modules/apiRoutes';
import dashboardImg from '../images/dashboard.png';
import settingsImg from '../images/settings.png';
import joinedEventImg from '../images/joinedEvents.png';
import myeventsImg from '../images/myEvents.png';
import createEventImg from '../images/create-event.png';
import registrationsImg from '../images/registrations.png';
import notificationImg from '../images/notifications.png';
import premiumIcon from '../images/premium.png';
import { Line } from 'react-chartjs-2';
import { FiClock, FiMapPin, FiInfo } from 'react-icons/fi'; // Example icons from react-icons library
import QRCode from 'qrcode.react';
import axios from 'axios';
import Navbar from '../componenets/Navbar';

const EventDetailsAdmin = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('/');
  const pathActive = useLocation();
  const [eventDetails, setEventDetails] = useState(null); // State to hold event details
  const [loading, setLoading] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false); // State to control modal visibility
  const [registrationData, setRegistrationData] = useState([]);
  const params = useParams();
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchEventDetails();
  }, [params.event_id]);


  const fetchEventDetails = async () => {
    try {
      // Fetch event details based on event_id
      const response = await axios.get(`${API_ROUTES.getEventDetails}/${params.event_id}`);
      setEventDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };


  // Function to handle navigation and update active link
  const handleNavigation = (path) => {
    navigate(path);
    setActiveLink(path);
  };




  const formatTime = (timeString) => {
    const eventTime = new Date(timeString);
    return eventTime.toLocaleString(); // Adjust locale and options as needed
  };

  const toggleQrModal = () => {
    setQrModalOpen(!qrModalOpen);
  };

  return (
    <div className="homepage-container">
<Navbar activeLink={activeLink} handleNavigation={handleNavigation} user={user} />

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar with Search and Icons */}
        <div className="top-bar">
          <div className="search-bar">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
              />
            </div>
          </div>
          <div className="right-icons">
            <button className="icon-btn">
              <img src={notificationImg} alt="Notification" className="nav-icon" />
            </button>
            <button className="icon-btn">
              <img src={settingsImg} alt="Settings" className="nav-icon" />
            </button>
            <button className="icon-btn">
              <img src={premiumIcon} alt="Premium" className="nav-icon" />
            </button>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="event-details">
          {eventDetails && (
            <>
              <div className="event-banner">
                <img src={`${API_ROUTES.bannersDisplay}/${eventDetails.image_path}`} alt="Event Banner" />
              </div>
              <div className="event-info">
                <h2>{eventDetails.event_name}</h2>
                <p>
                  <FiClock /> <strong>Start Time:</strong> {formatTime(eventDetails.date)}
                </p>
                <p>
                </p>
                <p>
                  <FiMapPin /> <strong>Location:</strong> {eventDetails.event_location}
                </p>
                <p>
                  <strong>Category:</strong> {eventDetails.event_type}
                </p>
                <div className="action-buttons">
                  <button className="deactivate-btn">Deactivate Event</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsAdmin;