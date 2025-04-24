'use client';

import React from 'react';

const MapSection: React.FC = () => {
  return (
    <div className="section-container">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl text-center mb-8 text-primary-green">Location</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2155710122!2d-73.9878448!3d40.7579747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1645555555555!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-700 mb-2">St. Mary's Church</p>
          <p className="text-gray-600">123 Main Street</p>
          <p className="text-gray-600">New York, NY 10001</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block mt-4"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapSection; 