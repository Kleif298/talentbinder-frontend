/**
 * Zentrale API-Konfiguration
 * Automatische Backend-URL Erkennung basierend auf Umgebung
 */

const isDevelopment = import.meta.env.MODE === 'development';

// Fallback to production backend if VITE_API_URL is not set
const API_ROOT = import.meta.env.VITE_API_URL || 
    (!isDevelopment ? 'https://talentbinder-backend.onrender.com' : '');

export const API_BASE_URL = API_ROOT ? `${API_ROOT.replace(/\/$/, '')}/api` : '/api';

// Log configuration in development
if (isDevelopment) {
    console.log('🔧 API Configuration:', {
        MODE: import.meta.env.MODE,
        VITE_API_URL: import.meta.env.VITE_API_URL,
        isDevelopment,
        API_ROOT,
        API_BASE_URL
    });
}
