'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTranslation, Language } from '../utils/i18n';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
  language: Language;
}

export default function RSVPModal({ isOpen, onClose, onSuccess, onError, language }: RSVPModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const { t } = useTranslation(language);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const attendanceInput = form.elements.namedItem('attendance') as HTMLSelectElement;

    try {
      await addDoc(collection(db, 'rsvp'), {
        name: nameInput.value.trim(),
        attendance: attendanceInput.value,
        numberOfPeople,
        timestamp: serverTimestamp()
      });
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      onError('There was an error submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-2xl mb-6 text-center">{t.rsvpModal.title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">{t.rsvpModal.name}</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t.rsvpModal.namePlaceholder}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">{t.rsvpModal.attendance}</label>
            <select 
              name="attendance" 
              className="w-full px-4 py-2 border rounded-lg" 
              required
              disabled={isSubmitting}
            >
              <option value="yes">{t.rsvpModal.attendanceYes}</option>
              <option value="no">{t.rsvpModal.attendanceNo}</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">{t.rsvpModal.numberOfPeople}</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setNumberOfPeople(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                disabled={isSubmitting || numberOfPeople <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-4 py-2 border rounded-lg text-center"
                min="1"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setNumberOfPeople(prev => prev + 1)}
                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                disabled={isSubmitting}
              >
                +
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 mb-4">
            {t.rsvpModal.confirmResponse}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              disabled={isSubmitting}
            >
              {t.rsvpModal.cancel}
            </button>
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--button-color)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? t.rsvpModal.submitting : t.rsvpModal.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 