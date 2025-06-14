'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HielplacePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  const wifiInfo = {
    ssid: 'U+Net9EB8_5G',
    password: 'G@24C39F58',
    security: 'WPA/WPA2-Personal'
  };

  const parkingInfo = {
    name: '관저다목적체육관',
    address: '대전 서구 관저중로 10',
    mapUrl: 'https://naver.me/GtJp3EKT'
  };

  const handleConnectWifi = async () => {
    try {
      // Create WiFi configuration string
      const wifiConfig = `WIFI:S:${wifiInfo.ssid};T:${wifiInfo.security};P:${wifiInfo.password};;`;
      
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: 'Connect to Venue WiFi',
          text: `Connect to ${wifiInfo.ssid}`,
          url: wifiConfig
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(wifiConfig);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share WiFi information:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg 
              className="w-16 h-16 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Venue Information</h1>
          <p className="text-lg text-gray-600">WiFi and Parking Details</p>
        </div>
        
        {/* WiFi Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center mb-6">
            <svg 
              className="w-8 h-8 text-blue-600 mr-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">WiFi Information</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Network Name</h3>
              <p className="text-xl font-mono text-blue-900">{wifiInfo.ssid}</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Password</h3>
              <p className="text-xl font-mono text-blue-900">{wifiInfo.password}</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Security Type</h3>
              <p className="text-lg text-blue-900">{wifiInfo.security}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleConnectWifi}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg 
                className="w-6 h-6 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
              {copied ? '✓ Copied!' : 'Connect to WiFi'}
            </button>
            <p className="mt-3 text-sm text-gray-500">
              {canShare ? 
                'Click to connect directly to the WiFi network' : 
                'Click to copy WiFi configuration to your clipboard'}
            </p>
          </div>
        </div>

        {/* Parking Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <svg 
              className="w-8 h-8 text-blue-600 mr-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Parking Information</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Venue Name</h3>
              <p className="text-xl text-blue-900">{parkingInfo.name}</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Address</h3>
              <p className="text-lg text-blue-900">{parkingInfo.address}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={parkingInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg 
                className="w-6 h-6 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Open in Naver Maps
            </a>
            <p className="mt-3 text-sm text-gray-500">
              Click to open the location in Naver Maps
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 