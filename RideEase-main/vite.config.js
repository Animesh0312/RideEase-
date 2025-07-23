import { defineConfig } from 'vite';
import { config } from 'dotenv';

// Load environment variables
config();

export default defineConfig({
  root: 'templates',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: '/templates/landing.html',
        login: '/templates/login',
        booking: '/templates/booking',
      },
    },
  },
  server: {
    port: 3000,
    open: 'login.html'
  },
  publicDir: '../',
  define: {
    'process.env': {
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
      FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      FIREBASE_APP_ID: JSON.stringify(process.env.FIREBASE_APP_ID),
      FIREBASE_MEASUREMENT_ID: JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID),
    }
  }
});