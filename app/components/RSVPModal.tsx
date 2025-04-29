'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const attendanceInput = form.elements.namedItem('attendance') as HTMLSelectElement;

    try {
      await addDoc(collection(db, 'rsvps'), {
        name: nameInput.value.trim(),
        attendance: attendanceInput.value,
        timestamp: serverTimestamp()
      });
      alert('Thank you for your RSVP!');
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error adding RSVP:', error);
      alert('There was an error submitting your RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-2xl mb-6 text-center">RSVP Form</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Your name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Will you attend?</label>
            <select 
              name="attendance" 
              className="w-full px-4 py-2 border rounded-lg" 
              required
              disabled={isSubmitting}
            >
              <option value="yes">Yes, I will attend</option>
              <option value="no">No, I cannot attend</option>
            </select>
          </div>
          <div className="text-center text-sm text-gray-600 mb-4">
            Please confirm your response
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--button-color)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 