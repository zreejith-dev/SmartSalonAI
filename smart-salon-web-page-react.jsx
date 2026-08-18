/**
 * SmartSalon AI — Static Web Page (React)
 * Based on: SmartSalon-AI-Design-Requirements.md and SmartSalon-AI-Stage1-PRD.md
 * Denow Unisex Saloon — Sultanpet, Palakkad
 * 
 * Design system:
 *   ink: #1C1B1F (dark surface)
 *   ink-soft: #2B2A30
 *   paper: #F7F5F1 (light surface)
 *   paper-raised: #FFFFFF
 *   amber: #C98A3E (primary accent)
 *   amber-soft: #E8C79A
 *   charcoal-text: #33323A
 *   mist-text: #B8B5C0
 *   success: #4C8B5F
 *   alert: #C25450
 * 
 * Typography:
 *   Display: Fraunces (serif, variable weight) — headlines only
 *   Body: Inter — all body text, form labels, buttons, nav labels
 *   Data: Inter (tabular figures) — prices, dates, phone numbers
 * 
 * Layout:
 *   Base spacing: 8px grid (8/16/24/32/48)
 *   Card corner radius: 16px primary, 12px small elements
 *   Card elevation: 0px 2px 8px rgba(28,27,31,0.08)
 */

import React, { useState } from 'react';
import './SmartSalonWebPage.css';

// Service catalogue from Justdial (Section 2 of DRD)
const services = [
  { category: 'Hair Styling', services: ['Hair Styling', 'Hair Cut', 'Hair Colour', 'Hair Straightening', 'Hair Blow Dry', 'Hair Curling', 'Hair Rebonding'] },
  { category: 'Beard Grooming', services: ['Beard Styling', 'Beard Shaving', 'Beard Trimming'] },
  { category: 'Waxing', services: ['Full Body', 'Under Arms', 'Full Leg', 'Full Arm', 'Half Arm', 'Face', 'Half Leg'] },
  { category: 'Hair Care', services: ['Hair Straightening', 'Hair Spa'] },
  { category: 'Face Care', services: ['Facial', 'Treatment 2', 'Treatment 3', 'Treatment 4'] },
  { category: 'Massage', services: ['Massage'] },
  { category: 'Manicure & Pedicure', services: ['Manicure', 'Pedicure'] },
  { category: 'Threading', services: ['Threading Full Face', 'Threading Half Face', 'Eyebrow Threading', 'Chin Threading', 'Full Arm Threading', 'Full Leg Threading', 'Half Arm Threading'] },
  { category: 'Makeup', services: ['Light Makeup', 'Basic Makeup', 'Groom Makeup'] }
];

export default function SmartSalonWebPage() {
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    preferred_datetime: '',
    service_requested: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send to n8n workflow or Supabase
    alert(`Booking request submitted!\nName: ${booking.name}\nPhone: ${booking.phone}\nPreferred: ${booking.preferred_datetime}\nService: ${booking.service_requested}`);
  };

  return (
    <div className="smart-salon-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="display-font">Denow Unisex Saloon</h1>
            <p className="lead">Serving Sultanpet for over 22 years</p>
            <div className="cta-button">
              <a href="#book">Book Appointment</a>
            </div>
          </div>
          <div className="hero-image">
            {/* Real Denow photo would go here */}
            <div className="placeholder-image">
              <h3>Real Salon Interior</h3>
              <p>Green accent walls, purple wash station area, black styling chairs</p>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <h2 className="section-header">Our Services</h2>
          <div className="services-grid">
            {services.map((category, catIndex) => (
              <div key={catIndex} className="service-category">
                <h3 className="category-title">{category.category}</h3>
                <div className="service-list">
                  {category.services.map((service, svcIndex) => (
                    <div key={svcIndex} className="service-card">
                      <span className="service-name">{service}</span>
                      <span className="service-price">₹XXX</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Home Service tag */}
          <div className="home-service-tag">
            🏠 Home Service Available
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-header">Before & After</h2>
          <div className="gallery-grid">
            {/* before/after photo pairs would go here */}
            <div className="placeholder-gallery">
              <p>Customer before/after photos</p>
              <p>(Real Denow customer photos with consent)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location Section */}
      <section className="hours-section">
        <div className="container">
          <div className="hours-content">
            <div className="hours-info">
              <h2 className="section-header">Hours & Location</h2>
              <p className="address">Aswathy Arcade, Only Organic Shop, SS Nair Road, Sultanpet, Palakkad – 678001, Kerala</p>
              <p className="hours-text">
                <strong>Open until 9:00 pm</strong> • 7 days a week
              </p>
              <div className="map-embed">
                {/* Google Maps embed would go here */}
                <div className="placeholder-map">
                  <p>Google Maps embed: Denow Unisex Saloon, Sultanpet</p>
                </div>
              </div>
            }
            <div className="contact-bar">
              <a href="https://wa.me/{{WHATSAPP_NUMBER}}" className="whatsapp-btn">
                💬 Chat on WhatsApp
              </a>
              <a href="#book" className="book-btn">
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Request Form */}
      <section className="booking-section" id="book">
        <div className="container">
          <h2 className="section-header">Book Appointment</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Your full name" 
                required 
                value={booking.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="Your phone number" 
                required 
                value={booking.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">Service</label>
              <select 
                id="service" 
                name="service_requested" 
                required 
                value={booking.service_requested}
                onChange={handleChange}
              >
                <option value="">Select a service</option>
                {services.flatMap(category =>
                  category.services.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="datetime">Preferred Date & Time</label>
              <input 
                type="datetime-local" 
                id="datetime" 
                name="preferred_datetime" 
                required 
                value={booking.preferred_datetime}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="primary-btn">
              Submit Booking Request
            </button>
            <p className="form-note">
              Submit your request — staff will contact you on WhatsApp to confirm.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <h3>Denow Unisex Saloon</h3>
              <p>Serving Sultanpet for over 22 years</p>
              <address>
                Aswathy Arcade, Only Organic Shop,<br/>
                SS Nair Road, Sultanpet, Palakkad – 678001, Kerala
              </address>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#services">Services</a></li>
                <li><a href="#book">Book</a></li>
                <li><a href="#location">Location</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href="https://wa.me/{{WHATSAPP_NUMBER}}" target="_blank">
                    💬 WhatsApp: {{WHATSAPP_NUMBER}}
                  </a>
                </li>
                <li><a href="mailto:info@denowsaloon.com">info@denowsaloon.com</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Denow Unisex Saloon. All rights reserved.</p>
            <p>Designed with craft & precision — Studio, not storefront</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* 
 * CSS — Inline for single-file simplicity.
 * Mobile-first responsive design with 8px grid base.
 * Breakpoints: mobile <640px, tablet 640-1024px, desktop >1024px
 */

SmartSalonWebPage.css`


/* Color Tokens */
:root {
  --ink: #1C1B1F;
  --ink-soft: #2B2A30;
  --paper: #F7F5F1;
  --paper-raised: #FFFFFF;
  --amber: #C98A3E;
  --amber-soft: #E8C79A;
  --charcoal-text: #33323A;
  --mist-text: #B8B5C0;
  --success: #4C8B5F;
  --alert: #C25450;
}

/* Typography */
@font-face {
  font-family: 'Fraunces';
  font-style: variable;
  font-weight: 400 700;
  src: local('Fraunces'), local('Fraunces-Regular'),
       url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&display=swap') format('css');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 600;
  src: local('Inter'), local('Inter-Regular'),
       url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap') format('css');
}

.display-font {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(28px, 5vw, 34px);
  color: var(--ink);
  line-height: 1.2;
}

.section-header {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--ink);
  margin-bottom: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lead {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  color: var(--mist-text);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.category-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--ink);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Layout */
.smart-salon-page {
  margin: 0;
  font-family: 'Inter', sans-serif, -apple-system, BlinkMacSystemFont;
  color: var(--charcoal-text);
  overflow-x: hidden;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: var(--ink);
  color: var(--paper);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  max-width: 640px;
  padding: 2rem;
}

.hero-image {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: url('/denow-hero.jpg') center/cover no-repeat;
  background-size: cover;
}

/* Placeholder for hero image when no real photo available */
.placeholder-image {
  background: var(--ink-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.placeholder-image h3 {
  color: var(--amber);
  margin-bottom: 0.5rem;
}

.placeholder-image p {
  color: var(--mist-text);
  font-size: 14px;
}

/* Services Section */
.services-section {
  padding: 4rem 0;
  background: var(--paper);
}

.services-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 640px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.service-category {
  background: var(--paper-raised);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(28, 27, 31, 0.08);
}

.service-list {
  display: grid;
  gap: 0.75rem;
}

.service-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.service-card:last-child {
  border-bottom: none;
}

.service-name {
  color: var(--ink);
}

.service-price {
  color: var(--amber);
  font-weight: 600;
}

/* Home Service tag */
.home-service-tag {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--amber);
  color: var(--ink);
  border-radius: 20px;
  font-weight: 600;
  text-align: center;
  display: block;
}

/* Gallery Section */
.gallery-section {
  padding: 4rem 0;
  background: var(--ink-soft);
  color: var(--paper);
}

.gallery-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.placeholder-gallery {
  background: var(--ink);
  border-radius: 16px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mist-text);
  font-size: 14px;
}

/* Hours & Location Section */
.hours-section {
  padding: 4rem 0;
  background: var(--paper);
}

.hours-content {
  display: grid;
  gap: 2rem;
}

@media (min-width: 640px) {
  .hours-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .hours-content {
    grid-template-columns: 2fr 1fr;
  }
}

.hours-info h2 {
  color: var(--ink);
  margin-bottom: 1rem;
}

.address {
  color: var(--mist-text);
  font-size: 14px;
  margin: 1rem 0;
}

.hours-text {
  font-size: 14px;
  margin: 1rem 0;
}

.hours-text strong {
  color: var(--ink);
}

.map-embed {
  margin-top: 2rem;
  background: var(--paper-raised);
  border-radius: 12px;
  padding: 1.5rem;
}

.placeholder-map {
  height: 200px;
  background: #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mist-text);
  font-size: 14px;
}

/* Booking Section */
.booking-section {
  padding: 4rem 0;
  background: var(--ink-soft);
  color: var(--paper);
}

.booking-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--amber);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--paper-raised);
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--amber);
  box-shadow: 0 0 0 3px var(--amber-soft);
}

.form-group input[type="tel"] {
  max-width: 200px;
}

.primary-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: var(--amber);
  color: var(--ink);
  border: none;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.primary-btn:hover {
  background: var(--amber-soft);
}

.form-note {
  margin-top: 1rem;
  font-size: 12px;
  color: var(--mist-text);
  text-align: center;
}

/* Footer */
.footer-section {
  padding: 3rem 0;
  background: var(--ink);
  color: var(--mist-text);
}

.footer-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.footer-about h3 {
  color: var(--paper);
  font-size: 18px;
  margin-bottom: 1rem;
}

.footer-about p {
  font-size: 14px;
  line-height: 1.6;
}

.footer-about address {
  font-style: normal;
  margin-top: 1rem;
  line-height: 1.6;
}

.footer-links h4,
.footer-contact h4 {
  color: var(--amber);
  font-size: 14px;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links ul,
.footer-contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li,
.footer-contact li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: var(--mist-text);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--amber);
}

.footer-contact li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.whatsapp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--alert);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.book-btn {
  background: var(--amber);
  color: var(--ink);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-left: 1rem;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ink-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--mist-text);
}

/* Responsive: under 640px */
@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .book-btn {
    margin-left: 0;
    width: 100%;
    margin-top: 0.5rem;
  }
}
`