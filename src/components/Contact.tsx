import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Contact.css';
import Header from './Header';
import Footer from './Footer';

function Contact() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:tuomas.reijonen@xamk.fi?subject=Yhteydenotto&body=${encodeURIComponent(message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <div className="contact">
          <div className="contact-info">
            <h1>{t('contact.contactInfo.header')}</h1>
            <p>{t('contact.contactInfo.university')}</p>
            <p>{t('contact.contactInfo.address')}</p>
            <p>{t('contact.contactInfo.postalCode')}</p>
            <p>{t('contact.contactInfo.businessId')}</p>
          </div>
          <div className="contact-address">
            <h3>{t('contact.campus.header')}</h3>
            <p>{t('contact.campus.address')}</p>
            <p>{t('contact.campus.postalCode')}</p>
            <p>{t('contact.campus.phone')}</p>
          </div>
          <div className="contact-social">
            <h3>{t('contact.social.header')}</h3>
            <p>{t('contact.social.email')}</p>
          </div>

          <div className="contact-form">
            <h3>{t('contact.header')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t('contact.emailLabel')}</label>
                <input
                  type="email"
                  id="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t('contact.messageLabel')}</label>
                <textarea
                  id="message"
                  placeholder={t('contact.messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                {t('contact.submitButton')}
              </button>
            </form>
          </div>

          <button className="back-button" onClick={handleBackClick}>
            {t('contact.backButton')}
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contact;
