import React from 'react';
import ReactDOM from 'react-dom/client';
import ChampionshipTracker from './ChampionshipTracker';

// Simple localStorage-based storage implementation
if (!window.storage) {
  window.storage = {
    async get(key) {
      try {
        const value = localStorage.getItem(key);
        return value ? { key, value } : null;
      } catch (error) {
        console.error('Storage get error:', error);
        return null;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(key, value);
        return { key, value };
      } catch (error) {
        console.error('Storage set error:', error);
        return null;
      }
    },
    async delete(key) {
      try {
        localStorage.removeItem(key);
        return { key, deleted: true };
      } catch (error) {
        console.error('Storage delete error:', error);
        return null;
      }
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChampionshipTracker />
  </React.StrictMode>
);
