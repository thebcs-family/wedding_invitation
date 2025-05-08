'use client';

import { useTranslation, Language } from '../utils/i18n';
import { useState } from 'react';

interface ShareButtonsProps {
  language: Language;
}

export default function ShareButtons({ language }: ShareButtonsProps) {
  const { t } = useTranslation(language);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);

  const addToCalendar = (calendarType: 'google' | 'apple' | 'outlook') => {
    // Wedding details
    const eventDetails = {
      title: "Federico & Cecilia's Wedding",
      description: t.invitationText,
      location: t.venue,
      // Format dates in ISO 8601 format
      startTime: '2025-06-14T16:30:00+09:00', // Adding timezone for Korea
      endTime: '2025-06-14T20:30:00+09:00',   // Adding timezone for Korea
    };

    let calendarUrl = '';

    switch (calendarType) {
      case 'google':
        calendarUrl = new URL('https://calendar.google.com/calendar/render').toString();
        calendarUrl += `?action=TEMPLATE`;
        calendarUrl += `&text=${encodeURIComponent(eventDetails.title)}`;
        calendarUrl += `&details=${encodeURIComponent(eventDetails.description)}`;
        calendarUrl += `&location=${encodeURIComponent(eventDetails.location)}`;
        calendarUrl += `&dates=${eventDetails.startTime.replace(/[-:]/g, '')}/${eventDetails.endTime.replace(/[-:]/g, '')}`;
        break;

      case 'apple':
        // Apple Calendar uses the webcal:// protocol
        const appleCalendarData = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Federico & Cecilia//Wedding//EN',
          'CALSCALE:GREGORIAN',
          'BEGIN:VEVENT',
          `SUMMARY:${eventDetails.title}`,
          `DESCRIPTION:${eventDetails.description}`,
          `LOCATION:${eventDetails.location}`,
          `DTSTART:${eventDetails.startTime.replace(/[-:]/g, '')}`,
          `DTEND:${eventDetails.endTime.replace(/[-:]/g, '')}`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\n');
        
        const blob = new Blob([appleCalendarData], { type: 'text/calendar' });
        calendarUrl = URL.createObjectURL(blob);
        break;

      case 'outlook':
        calendarUrl = new URL('https://outlook.live.com/calendar/0/deeplink').toString();
        calendarUrl += `?path=/calendar/action/compose`;
        calendarUrl += `&subject=${encodeURIComponent(eventDetails.title)}`;
        calendarUrl += `&body=${encodeURIComponent(eventDetails.description)}`;
        calendarUrl += `&location=${encodeURIComponent(eventDetails.location)}`;
        calendarUrl += `&startdt=${eventDetails.startTime}`;
        calendarUrl += `&enddt=${eventDetails.endTime}`;
        break;
    }

    window.open(calendarUrl, '_blank');
    setShowCalendarOptions(false);
  };

  return (
    <>
      <button
        onClick={() => setShowCalendarOptions(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        {t.calendar?.addToCalendar || 'Add to Calendar'}
      </button>

      {/* Calendar Options Modal */}
      {showCalendarOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Choose Calendar</h3>
            <div className="space-y-3">
              <button
                onClick={() => addToCalendar('google')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-3.868 0-7-3.14-7-7.018 0-3.878 3.132-7.018 7-7.018 1.89 0 3.47.697 4.682 1.829l-1.974 1.978c-.5-.5-1.15-.777-1.708-.777-1.47 0-2.662 1.195-2.662 2.667 0 1.472 1.192 2.667 2.662 2.667 1.47 0 2.662-1.195 2.662-2.667h-2.662v-2.667h5.324c.066.333.106.677.106 1.018 0 3.878-3.132 7.018-7 7.018z"/>
                </svg>
                Google Calendar
              </button>
              <button
                onClick={() => addToCalendar('apple')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple Calendar
              </button>
              <button
                onClick={() => addToCalendar('outlook')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.5 2H2.5C1.67 2 1 2.67 1 3.5v17c0 .83.67 1.5 1.5 1.5h19c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5zM21 20H3V4h18v16zM8 6H4v2h4V6zm0 4H4v2h4v-2zm0 4H4v2h4v-2zm6-8h-4v2h4V6zm0 4h-4v2h4v-2zm0 4h-4v2h4v-2zm6-8h-4v2h4V6zm0 4h-4v2h4v-2zm0 4h-4v2h4v-2z"/>
                </svg>
                Outlook Calendar
              </button>
            </div>
            <button
              onClick={() => setShowCalendarOptions(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
} 