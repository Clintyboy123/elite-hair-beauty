import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { MotionGlobalConfig } from 'motion/react';
import App from './App';
import './styles/index.css';

// Every load starts at the top; page changes handle their own scrolling.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Development only: /?qa finishes every animation instantly, for layout screenshots.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('qa')) {
  MotionGlobalConfig.skipAnimations = true;
  document.head.insertAdjacentHTML('beforeend', '<style>*,*::before,*::after{transition:none!important}</style>');
}

// Development only: /?blocksound behaves like a browser that refuses sound until the page has been clicked or
// tapped (Safari's default, Chrome on a first visit), to test the welcome voice's fallback.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('blocksound')) {
  const realPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function play(...args) {
    if (!navigator.userActivation?.isActive && !window.__elitePageClicked) return Promise.reject(new DOMException('Blocked (test)', 'NotAllowedError'));
    return realPlay.apply(this, args);
  };
  ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => (window.__elitePageClicked = true), { capture: true }));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
