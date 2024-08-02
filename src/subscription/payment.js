import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ROUTES } from '../app modules/apiRoutes';
import Navbar from '../componenets/Navbar'; // Import the Navbar component
import { loadStripe } from '@stripe/stripe-js';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios';
import './payment.css';
const stripePromise = loadStripe('pk_test_51LoS3iSGyKMMAZwsaj8KZX4Sqqffth0eo9jyTSElpu9UG8M815kZdSIg1huPtPgke75vqtymOLDXtwosJrEYBWPh001ecyI5aW');

const Payment = () => {
  const [user, setUser] = useState({});
  const [activeLink, setActiveLink] = useState('/');
  const pathActive = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(pathActive.pathname);
  }, [pathActive.pathname]);

  const handleNavigation = (path) => {
    navigate(path);
    setActiveLink(path);
  };

  const handleSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Create Stripe checkout session
      const sessionResponse = await axios.post(API_ROUTES.createCheckOutSession, { token });
      const sessionId = sessionResponse.data.sessionId;

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        // Handle error display or logging
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      // Handle general subscription error
    }
  };

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

  return (
    <div className="homepage-container">
      <Navbar activeLink={activeLink} handleNavigation={handleNavigation} user={user} />

      <div className="main-content">
        <div className="SubscriptionPlan dark-theme">
          <h2>Premium Subscription</h2>
          <h3>₹300 per month</h3>
          <p>Upgrade to Premium to unlock advanced features for managing your events effortlessly.</p>
          <ul>
            <li><FaCheck /> Manage up to 10 events concurrently</li>
            <li><FaCheck /> Unlimited registrations per event</li>
            <li><FaCheck /> Customizable event details and attendee management</li>
            <li><FaCheck /> Advanced analytics and reporting</li>
            <li><FaCheck /> Priority customer support</li>
            <li><FaCheck /> Access to premium templates and designs</li>
            <li><FaCheck /> Integration with CRM tools</li>
            <li><FaCheck /> Automated email notifications and reminders</li>
          </ul>
          <div className='subscriptionBtn'>
            <button onClick={handleSubscription}>Subscribe Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;