'use client';

import React from 'react';

const BankInfo: React.FC = () => {
  return (
    <div className="section-container">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl text-center mb-8" style={{ color: 'var(--primary-green)' }}>
          Gift Information
        </h2>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--secondary-green)' }}>
                Bank Transfer (Korea)
              </h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Bank:</span> Shinhan Bank</p>
                <p><span className="font-semibold">Account Number:</span> 123-456-7890</p>
                <p><span className="font-semibold">Account Holder:</span> Person1 & Person2</p>
                <p><span className="font-semibold">SWIFT Code:</span> SHBKKRSE</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--secondary-green)' }}>
                PayPal
              </h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Email:</span> gifts@Person1andPerson2.com</p>
                <a 
                  href="https://paypal.me/Person1andPerson2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-block mt-4"
                >
                  Send Gift via PayPal
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-600">
            <p>Your presence is the greatest gift, but if you wish to contribute,</p>
            <p>we would be grateful for your generosity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInfo; 