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
    PROFILE_LINK: `${API_BASE_URL}/api/profile/link`,
    PROFILE_GET: (userId: string) => `${API_BASE_URL}/api/profile?user_id=${encodeURIComponent(userId)}`,

    // Social Media OSINT
    SOCIAL_SCAN: `${API_BASE_URL}/api/social/scan`,
    SOCIAL_SEARCH: (username: string) => `${API_BASE_URL}/api/social/search?username=${encodeURIComponent(username)}`,
    SOCIAL_PLATFORMS: `${API_BASE_URL}/api/social/platforms`,
    SOCIAL_CONNECT: `${API_BASE_URL}/api/social/connect`,
    SOCIAL_HISTORY: (userId: string) => `${API_BASE_URL}/api/social/history?user_id=${encodeURIComponent(userId)}`,

    // Steganography
    STEGO_ANALYZE: `${API_BASE_URL}/api/stego/analyze`,
    STEGO_EXTRACT: `${API_BASE_URL}/api/stego/extract`,
    STEGO_HISTORY: (userId: string) => `${API_BASE_URL}/api/stego/history?user_id=${encodeURIComponent(userId)}`,
    STEGO_METHODS: `${API_BASE_URL}/api/stego/methods`,

    // Reverse OSINT
    REVERSE_OSINT_VISITORS: `${API_BASE_URL}/api/reverse-osint/visitors`,
    REVERSE_OSINT_MAP: (hours: number) => `${API_BASE_URL}/api/reverse-osint/map?hours=${hours}`,
    REVERSE_OSINT_THREATS: `${API_BASE_URL}/api/reverse-osint/threats`,
    REVERSE_OSINT_STATS: `${API_BASE_URL}/api/reverse-osint/stats`,
    REVERSE_OSINT_HONEYPOT: `${API_BASE_URL}/api/reverse-osint/honeypot`,

    // WebSocket
    WS_ALERTS: `${API_BASE_URL.replace('http', 'ws')}/ws/alerts`,
};
