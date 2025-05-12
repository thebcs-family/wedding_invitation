'use client';

import { useTranslation, Language } from '../utils/i18n';
import 'add-to-calendar-button';

interface ShareButtonsProps {
  language: Language;
}

export default function ShareButtons({ language }: ShareButtonsProps) {
  const { t } = useTranslation(language);

  return (
    <add-to-calendar-button
      name="Federico & Cecilia's Wedding"
      description={t.invitationText}
      startDate="2025-06-14"
      startTime="16:30"
      endTime="20:30"
      timeZone="Asia/Seoul"
      location={t.venue}
      options="['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'Yahoo']"
      trigger="click"
      inline
      listStyle="modal"
      iCalFileName="Federico-Cecilia-Wedding"
      buttonStyle="default"
      size="3"
      label={t.calendar?.addToCalendar || 'Add to Calendar'}
      language={language}
      styleLight="--btn-background: white; --btn-text-color: #333; --btn-border: 1px solid #ddd; --btn-shadow: 0 2px 4px rgba(0,0,0,0.1); --btn-hover-background: #f8f8f8;"
      styleDark="--btn-background: #333; --btn-text-color: white; --btn-border: 1px solid #444; --btn-shadow: 0 2px 4px rgba(0,0,0,0.2); --btn-hover-background: #444;"
    />
  );
} 