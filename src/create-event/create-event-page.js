import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './createevent.css';
import { API_ROUTES } from '../app modules/apiRoutes';
import Navbar from '../componenets/Navbar';

const CreateEventPage = () => {
  const [user, setUser] = useState({});
  const [activeLink, setActiveLink] = useState('/');
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventType: '',
    eventImage: null,
  });
  const navigate = useNavigate();
  const pathActive = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Effect to set active link based on current path
  useEffect(() => {
    setActiveLink(pathActive.pathname);
  }, [pathActive.pathname]);

  // Effect to fetch user details on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_ROUTES.fetchUserDetails, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { eventName, eventDate, eventTime, eventLocation, eventType, eventImage } = formData;

    // Basic validation
    if (!eventName || !eventDate) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formDataWithImage = new FormData();
      formDataWithImage.append('eventName', eventName);
      formDataWithImage.append('eventDate', eventDate);
      formDataWithImage.append('eventTime', eventTime);
      formDataWithImage.append('eventLocation', eventLocation);
      formDataWithImage.append('eventType', eventType);
      formDataWithImage.append('eventImage', eventImage);

      const response = await fetch(API_ROUTES.createEvent, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataWithImage,
      });

      if (!response.ok) {
        throw new Error('Failed to create event.');
      }

      setSubmitting(false);
      navigate('/dashboard'); // Redirect to home or event list page after successful submission
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again later.');
      setSubmitting(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle different types of inputs
    if (type === 'file') {
      setFormData(prevState => ({
        ...prevState,
        [name]: e.target.files[0], // Store the file object
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className="homepage-container">
      <Navbar activeLink={activeLink} handleNavigation={navigate} user={user} />
      <div className="event-form-container">
        <h2>Create Event</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
          />
          <label htmlFor="eventDate">Event Date:</label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="eventTime">Event Time:</label>
          <input
            type="time"
            id="eventTime"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
          />
          <label htmlFor="eventLocation">Event Location:</label>
          <input
            type="text"
            id="eventLocation"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
          />
          <label htmlFor="eventType">Event Type:</label>
          <input
            type="text"
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
          />
          <label htmlFor="eventImage">Event Image:</label>
          <input
            type="file"
            id="eventImage"
            name="eventImage"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;