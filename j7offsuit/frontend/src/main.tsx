import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import SharedGamePage from './pages/SharedGamePage';
import './styles.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}

if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      caches.delete(key);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="games/:gameId" element={<GamePage />} />
            <Route path="share/:token" element={<SharedGamePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
);