'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function MessageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement;

    try {
      await addDoc(collection(db, 'messages'), {
        name: nameInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: serverTimestamp()
      });
      form.reset();
      alert('Thank you for your message!');
    } catch (error) {
      console.error('Error adding message:', error);
      alert('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        <label className="block text-gray-700 mb-2">Message</label>
        <textarea
          name="message"
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
          placeholder="Your message"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="text-white px-8 py-3 rounded-lg transition-colors text-lg"
          style={{ backgroundColor: 'var(--button-color)' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
} 