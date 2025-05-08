'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useTranslation, Language } from '../utils/i18n';

interface MessageFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  language: Language;
}

export default function MessageForm({ onSuccess, onError, language }: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation(language);

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
      onSuccess();
    } catch (error) {
      console.error('Error adding message:', error);
      onError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">{t.messageForm.name}</label>
        <input
          type="text"
          name="name"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder={t.messageForm.namePlaceholder}
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">{t.messageForm.message}</label>
        <textarea
          name="message"
          className="w-full px-4 py-2 border rounded-lg"
          rows={4}
          placeholder={t.messageForm.messagePlaceholder}
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
          {isSubmitting ? t.messageForm.sending : t.messageForm.sendMessage}
        </button>
      </div>
    </form>
  );
} 