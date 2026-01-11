import { useState } from 'react';
import { Key, Save, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface APIKey {
    service: string;
    key: string;
    status: 'active' | 'inactive' | 'invalid';
    rateLimit?: number;
    usage?: number;
}

export function APIKeyConfiguration() {
    const [keys, setKeys] = useState<Record<string, string>>({
        instagram: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        hibp: '',
        ipgeolocation: '',
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const serviceInfo = {
        instagram: {
            name: 'Instagram API',
            description: 'Required for Instagram profile scanning',
            link: 'https://developers.facebook.com/docs/instagram-api',
            free: false
        },
        twitter: {
            name: 'Twitter/X API',
            description: 'Required for Twitter profile scanning',
            link: 'https://developer.twitter.com/',
            free: true
        },
        facebook: {
            name: 'Facebook Graph API',
            description: 'Required for Facebook profile scanning',
            link: 'https://developers.facebook.com/',
            free: true
        },
        linkedin: {
            name: 'LinkedIn API',
            description: 'Required for LinkedIn profile scanning',
            link: 'https://www.linkedin.com/developers/',
            free: false
        },
        hibp: {
            name: 'Have I Been Pwned',
            description: 'Check if email addresses have been in data breaches',
            link: 'https://haveibeenpwned.com/API/Key',
            free: false
        },
        ipgeolocation: {
            name: 'IP Geolocation',
            description: 'Get location data from IP addresses for Reverse OSINT',
            link: 'https://ipgeolocation.io/',
            free: true
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            // In a real implementation, this would securely send keys to backend
            // For now, we'll store in localStorage (NOT SECURE - just for demo)
            const nonEmptyKeys = Object.entries(keys).filter(([_, value]) => value.trim() !== '');

            if (nonEmptyKeys.length === 0) {
                setMessage({ type: 'error', text: 'Please enter at least one API key' });
                setSaving(false);
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store keys (in production, send to secure backend)
            localStorage.setItem('osint_api_keys', JSON.stringify(keys));

            setMessage({ type: 'success', text: `Successfully saved ${nonEmptyKeys.length} API key(s)!` });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save API keys' });
        } finally {
            setSaving(false);
        }
    };

    const handleKeyChange = (service: string, value: string) => {
        setKeys(prev => ({ ...prev, [service]: value }));
    };

    const loadFromEnv = () => {
        // In production, this would load from secure backend
        const stored = localStorage.getItem('osint_api_keys');
        if (stored) {
            setKeys(JSON.parse(stored));
            setMessage({ type: 'success', text: 'Loaded saved API keys' });
        } else {
            setMessage({ type: 'error', text: 'No saved API keys found' });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl mb-2">API Key Configuration</h2>
                <p className="text-slate-400">
                    Configure API keys to enable real data collection from external services
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-200">
                        <div className="font-medium mb-1">Important Security Note</div>
                        <div className="text-blue-300">
                            In production, API keys should be stored securely on the backend and never exposed to the frontend.
                            This interface is for demonstration purposes. For production use, implement proper key management on your server.
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`border rounded-lg p-4 flex items-start gap-3 ${message.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    )}
                    <div className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                        {message.text}
                    </div>
                </div>
            )}

            {/* API Keys Grid */}
            <div className="grid grid-cols-1 gap-4">
                {Object.entries(serviceInfo).map(([serviceId, info]) => (
                    <div key={serviceId} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg">{info.name}</h3>
                                    {info.free && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                                            Free Tier Available
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400">{info.description}</p>
                            </div>
                            <a
                                href={info.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap ml-4"
                            >
                                Get API Key →
                            </a>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <input
                                    type="password"
                                    value={keys[serviceId]}
                                    onChange={(e) => handleKeyChange(serviceId, e.target.value)}
                                    placeholder={`Enter ${info.name} key...`}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                />
                            </div>
                            <button
                                onClick={() => handleKeyChange(serviceId, '')}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save API Keys'}
                </button>

                <button
                    onClick={loadFromEnv}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    Load Saved Keys
                </button>
            </div>

            {/* Instructions */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="mb-4">How to Get API Keys</h3>
                <div className="space-y-3 text-sm text-slate-300">
                    <div>
                        <strong className="text-slate-200">1. Free Services (Recommended for Testing):</strong>
                        <ul className="list-disc list-inside ml-4 mt-1 text-slate-400 space-y-1">
                            <li>Twitter API - Free tier available with rate limits</li>
                            <li>IP Geolocation - Free tier: 1000 requests/month</li>
                            <li>Facebook Graph API - Free with Facebook Developer account</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-slate-200">2. Paid Services (For Production):</strong>
                        <ul className="list-disc list-inside ml-4 mt-1 text-slate-400 space-y-1">
                            <li>Instagram API - Requires Facebook Business account</li>
                            <li>Have I Been Pwned - $3.50/month for API access</li>
                            <li>LinkedIn API - Requires approval and partnership</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-slate-200">3. Alternative (Use Mock Data):</strong>
                        <p className="ml-4 mt-1 text-slate-400">
                            Without API keys, the system will continue to use realistic mock data for demonstrations.
                            This is perfect for testing and showcasing the platform's capabilities.
                        </p>
                    </div>
                </div>
            </div>

            {/* Current Status */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Current Configuration Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(keys).map(([service, key]) => (
                        <div key={service} className="p-3 bg-slate-800/30 rounded-lg">
                            <div className="text-xs text-slate-500 mb-1 capitalize">{service}</div>
                            <div className={`text-sm font-medium ${key ? 'text-green-400' : 'text-slate-500'}`}>
                                {key ? '✓ Configured' : '○ Not Set'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
