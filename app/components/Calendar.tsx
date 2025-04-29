'use client';

import { useEffect, useState } from 'react';

export default function Calendar() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const weddingDate = new Date('2025-06-14T16:30:00');
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calendar-container">
      <div className="calendar-header">June 2025</div>
      <div className="calendar-grid">
        <div className="calendar-day sunday">Su</div>
        <div className="calendar-day">Mo</div>
        <div className="calendar-day">Tu</div>
        <div className="calendar-day">We</div>
        <div className="calendar-day">Th</div>
        <div className="calendar-day">Fr</div>
        <div className="calendar-day saturday">Sa</div>
        <div className="calendar-day sunday">1</div>
        <div className="calendar-day">2</div>
        <div className="calendar-day">3</div>
        <div className="calendar-day">4</div>
        <div className="calendar-day">5</div>
        <div className="calendar-day">6</div>
        <div className="calendar-day saturday">7</div>
        <div className="calendar-day sunday">8</div>
        <div className="calendar-day">9</div>
        <div className="calendar-day">10</div>
        <div className="calendar-day">11</div>
        <div className="calendar-day">12</div>
        <div className="calendar-day">13</div>
        <div className="calendar-day highlight">14</div>
        <div className="calendar-day sunday">15</div>
        <div className="calendar-day">16</div>
        <div className="calendar-day">17</div>
        <div className="calendar-day">18</div>
        <div className="calendar-day">19</div>
        <div className="calendar-day">20</div>
        <div className="calendar-day saturday">21</div>
        <div className="calendar-day sunday">22</div>
        <div className="calendar-day">23</div>
        <div className="calendar-day">24</div>
        <div className="calendar-day">25</div>
        <div className="calendar-day">26</div>
        <div className="calendar-day">27</div>
        <div className="calendar-day saturday">28</div>
        <div className="calendar-day sunday">29</div>
        <div className="calendar-day">30</div>
      </div>
      <div className="countdown">{countdown}</div>
      <div className="countdown-text">Until our special day</div>
    </div>
  );
} 