// @ts-ignore
const isProd = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

export const API_BASE_URL = isProd
    ? 'https://bluerayscanbackend.onrender.com'
    : 'http://localhost:8000';

export const API_ENDPOINTS = {
    SCAN: `${API_BASE_URL}/api/scan`,
    SCAN_VIDEO: `${API_BASE_URL}/api/scan/video`,
    SCAN_AUDIO: `${API_BASE_URL}/api/scan/audio`,
    STATS: `${API_BASE_URL}/api/stats`,
    OSINT_SEARCH: (email: string) => `${API_BASE_URL}/api/intelligence/search?email=${encodeURIComponent(email)}`,
};
