import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Toast notification container component
 * Uses react-hot-toast for notifications
 */
export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: '#1e1e2a',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        // Custom styles for different toast types
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#1e1e2a',
          },
          style: {
            border: '1px solid rgba(16, 185, 129, 0.2)',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1e1e2a',
          },
          style: {
            border: '1px solid rgba(239, 68, 68, 0.2)',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            border: '1px solid rgba(147, 51, 234, 0.2)',
          },
        },
      }}
    />
  );
}

