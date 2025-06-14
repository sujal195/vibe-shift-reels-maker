
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { preloadCriticalImages } from './utils/imageUtils';

// Preload critical images (LCP candidates)
preloadCriticalImages([
  '/src/assets/optimized-placeholder.svg'
]);

// Web Vitals reporting
const reportWebVitals = () => {
  if ('web-vitals' in window) {
    import('web-vitals').then(({ onCLS, onINP, onLCP, onTTFB, onFCP }) => {
      onCLS(metric => {
        console.log('CLS:', metric.value);
        sendToAnalytics(metric);
      });
      onINP(metric => {
        console.log('INP:', metric.value);
        sendToAnalytics(metric);
      });
      onLCP(metric => {
        console.log('LCP:', metric.value);
        sendToAnalytics(metric);
      });
      onTTFB(metric => {
        console.log('TTFB:', metric.value);
        sendToAnalytics(metric);
      });
      onFCP(metric => {
        console.log('FCP:', metric.value);
        sendToAnalytics(metric);
      });
    });
  }
};

// Send metrics to analytics (can be connected to GA or custom endpoint)
const sendToAnalytics = (metric: any) => {
  // You can implement your analytics tracking here
  // For now we just log to console in production
  if (import.meta.env.PROD) {
    console.log(`Metric: ${metric.name} | Value: ${metric.value}`);
  }
};

// Register service worker for PWA support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize the app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Report web vitals in production
if (import.meta.env.PROD) {
  reportWebVitals();
}
