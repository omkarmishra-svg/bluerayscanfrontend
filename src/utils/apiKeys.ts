// API Key Management Utility
// This helps components access user-configured API keys

interface APIKeys {
    instagram: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    hibp: string;
    ipgeolocation: string;
}

export const getAPIKeys = (): Partial<APIKeys> => {
    try {
        const stored = localStorage.getItem('osint_api_keys');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to load API keys:', error);
    }
    return {};
};

export const hasAPIKey = (service: keyof APIKeys): boolean => {
    const keys = getAPIKeys();
    return !!(keys[service] && keys[service].trim() !== '');
};

export const getAPIKey = (service: keyof APIKeys): string | null => {
    const keys = getAPIKeys();
    return keys[service] || null;
};

export const setAPIKeys = (keys: Partial<APIKeys>): void => {
    try {
        localStorage.setItem('osint_api_keys', JSON.stringify(keys));
    } catch (error) {
        console.error('Failed to save API keys:', error);
    }
};

// Validation helpers
export const validateUsername = (username: string): { valid: boolean; error?: string } => {
    if (!username || !username.trim()) {
        return { valid: false, error: 'Username cannot be empty' };
    }

    if (username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (username.length > 30) {
        return { valid: false, error: 'Username is too long (max 30 characters)' };
    }

    // Check for valid characters (letters, numbers, dots, underscores)
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
        return { valid: false, error: 'Username can only contain letters, numbers, dots and underscores' };
    }

    return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
    if (!email || !email.trim()) {
        return { valid: false, error: 'Email cannot be empty' };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Please enter a valid email address' };
    }

    return { valid: true };
};

export const extractUsernameFromURL = (url: string, platform?: string): { username: string | null; error?: string } => {
    try {
        // Common social media URL patterns
        const patterns = [
            /(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9._]+)/,
            /(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/,
            /facebook\.com\/([a-zA-Z0-9.]+)/,
            /linkedin\.com\/in\/([a-zA-Z0-9-]+)/,
            /tiktok\.com\/@([a-zA-Z0-9._]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return { username: match[1] };
            }
        }

        return { username: null, error: 'Could not extract username from URL' };
    } catch {
        return { username: null, error: 'Invalid URL format' };
    }
};

// Mock data indicator
export const isUsingMockData = (): boolean => {
    const keys = getAPIKeys();
    return Object.values(keys).filter(key => key && key.trim() !== '').length === 0;
};
