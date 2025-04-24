'use client';

import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface MessageSectionProps {
  isMobile: boolean;
}

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
}

const MessageSection: React.FC<MessageSectionProps> = ({ isMobile }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Set up real-time listener for messages
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Message[];
      setMessages(newMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        name: name.trim(),
        message: message.trim(),
        timestamp: Timestamp.now()
      });
      setName('');
      setMessage('');
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error adding message:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl text-center mb-8 text-primary-green">Leave a Message</h2>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              className="w-full p-2 border border-gray-300 rounded h-32"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          {submitStatus === 'success' && (
            <p className="text-green-600 mt-2">Message sent successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-600 mt-2">Failed to send message. Please try again.</p>
          )}
        </form>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-50 p-4 rounded">
              <div className="font-semibold">{msg.name}</div>
              <div className="text-gray-600">{msg.message}</div>
              <div className="text-sm text-gray-400 mt-2">
                {msg.timestamp.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSection; 