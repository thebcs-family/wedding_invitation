'use client';

import { useTranslation, Language } from '../utils/i18n';
import dynamic from 'next/dynamic';

interface ShareButtonsProps {
  language: Language;
}

const AddToCalendarClient = dynamic(() => import('./AddToCalendarClient'), { ssr: false });

export default function ShareButtons({ language }: ShareButtonsProps) {
  const { t } = useTranslation(language);

  return (
    <AddToCalendarClient
      name="Federico & Cecilia's Wedding"
      description={`${t.invitationText}\n\nWebsite: [url]https://fedececy.com|fedececy.com[/url]`}
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
      styleLight="--btn-background: var(--button-color); --btn-text: white; --btn-text-color: white; --btn-border: none; --btn-shadow: none; --btn-border-radius: 0.5rem; --btn-padding: 0.75rem 1.5rem; --btn-font-size: 1.125rem; --btn-line-height: 1.25rem; --font-family: inherit; --font: inherit; --font-weight: 400; --btn-font: inherit; --btn-font-weight: 400; --btn-white-space: nowrap; --btn-width: 12rem; --btn-min-width: 12rem; --btn-max-width: 12rem; --btn-display: inline-flex; --btn-align-items: center; --btn-justify-content: center; --icon-display: inline-flex; --icon-margin: 0 0.25rem 0 0; --text-display: inline-flex; --checkmark-display: inline-flex; --checkmark-margin: 0 0 0 0.25rem; --dropdown-anchor-display: none; --btn-flex-direction: row; --btn-flex-wrap: nowrap; --btn-height: 3rem; --list-style: modal;"    />
  );
} 