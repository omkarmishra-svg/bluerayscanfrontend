import { useState } from 'react';
import { Instagram, Twitter, Facebook, Linkedin, Search, MapPin, Smartphone, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

type Platform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';

interface SocialProfile {
    platform: string;
    username: string;
    profile: any;
    posts: any[];
    metadata_summary: any;
    exposure_metrics: any;
}

export function SocialMediaMonitor() {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
    const [username, setUsername] = useState('');
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<SocialProfile | null>(null);

    const platforms = [
        { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
        { id: 'twitter' as Platform, name: 'Twitter/X', icon: Twitter, color: 'from-blue-400 to-blue-600' },
        { id: 'facebook' as Platform, name: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-800' },
        { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin, color: 'from-blue-700 to-cyan-600' },
    ];

    const handleScan = async () => {
        if (!username.trim()) {
            alert('Please enter a username');
            return;
        }

        setScanning(true);
        setResult(null);

        try {
            const response = await fetch(API_ENDPOINTS.SOCIAL_SCAN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platform: selectedPlatform,
                    username: username,
                    deep_scan: true,
                    user_id: 'demo'
                })
            });

            if (!response.ok) {
                throw new Error(`Scan failed (Status ${response.status})`);
            }

            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            console.error('Social media scan error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl mb-2">Social Media OSINT</h2>
                <p className="text-slate-400">
                    Monitor digital footprints and extract metadata from social media profiles
                </p>
            </div>

            {/* Platform Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                        <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${selectedPlatform === platform.id
                                    ? `bg-gradient-to-br ${platform.color} border-transparent text-white`
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
                                }`}
                        >
                            <Icon className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm font-medium">{platform.name}</div>
                        </button>
                    );
                })}
            </div>

            {/* Search Box */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="mb-4">Search Profile</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                        placeholder={`Enter ${selectedPlatform} username...`}
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleScan}
                        disabled={scanning}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                        <Search className="w-5 h-5" />
                        {scanning ? 'Scanning...' : 'Scan Profile'}
                    </button>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Profile Overview */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-start gap-6">
                            <img
                                src={result.profile.profile_picture}
                                alt={result.profile.username}
                                className="w-24 h-24 rounded-full border-2 border-slate-700"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl">{result.profile.display_name}</h3>
                                    {result.profile.verified && (
                                        <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                                            Verified
                                        </div>
                                    )}
                                </div>
                                <div className="text-slate-400 mb-3">@{result.profile.username}</div>
                                <p className="text-slate-300 mb-4">{result.profile.bio}</p>
                                <div className="flex gap-6 text-sm">
                                    <div>
                                        <div className="text-slate-500">Followers</div>
                                        <div className="text-lg font-semibold">{result.profile.followers.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500">Following</div>
                                        <div className="text-lg font-semibold">{result.profile.following.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500">Posts</div>
                                        <div className="text-lg font-semibold">{result.profile.total_posts.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exposure Metrics */}
                    {result.exposure_metrics && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                            <h3 className="mb-4">Exposure Assessment</h3>

                            {/* Exposure Score */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-400">Exposure Score</span>
                                    <span className={`font-semibold ${result.exposure_metrics.exposure_level === 'HIGH' ? 'text-red-400' :
                                            result.exposure_metrics.exposure_level === 'MEDIUM' ? 'text-yellow-400' :
                                                'text-green-400'
                                        }`}>
                                        {result.exposure_metrics.exposure_score}/100
                                    </span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${result.exposure_metrics.exposure_level === 'HIGH' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                                result.exposure_metrics.exposure_level === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                    'bg-gradient-to-r from-green-500 to-green-600'
                                            }`}
                                        style={{ width: `${result.exposure_metrics.exposure_score}%` }}
                                    />
                                </div>
                            </div>

                            {/* Privacy Concerns */}
                            {result.exposure_metrics.privacy_concerns && result.exposure_metrics.privacy_concerns.length > 0 && (
                                <div>
                                    <h4 className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                        Privacy Concerns Detected
                                    </h4>
                                    <div className="space-y-2">
                                        {result.exposure_metrics.privacy_concerns.map((concern: string, idx: number) => (
                                            <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-200">
                                                {concern}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Metadata Summary */}
                    {result.metadata_summary && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                            <h3 className="mb-4">Metadata Intelligence</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {result.metadata_summary.unique_locations && result.metadata_summary.unique_locations.length > 0 && (
                                    <div className="p-4 bg-slate-800/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                                            <MapPin className="w-5 h-5" />
                                            <span className="text-sm">Locations Exposed</span>
                                        </div>
                                        <div className="text-2xl font-semibold mb-2">{result.metadata_summary.total_locations_exposed}</div>
                                        {result.metadata_summary.unique_locations.slice(0, 3).map((loc: string, idx: number) => (
                                            <div key={idx} className="text-xs text-slate-500">• {loc}</div>
                                        ))}
                                    </div>
                                )}

                                {result.metadata_summary.devices_used && result.metadata_summary.devices_used.length > 0 && (
                                    <div className="p-4 bg-slate-800/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                                            <Smartphone className="w-5 h-5" />
                                            <span className="text-sm">Devices Detected</span>
                                        </div>
                                        <div className="text-2xl font-semibold mb-2">{result.metadata_summary.devices_used.length}</div>
                                        {result.metadata_summary.devices_used.map((device: string, idx: number) => (
                                            <div key={idx} className="text-xs text-slate-500">• {device}</div>
                                        ))}
                                    </div>
                                )}

                                {result.metadata_summary.most_active_hour !== undefined && (
                                    <div className="p-4 bg-slate-800/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3 text-slate-400">
                                            <Calendar className="w-5 h-5" />
                                            <span className="text-sm">Activity Pattern</span>
                                        </div>
                                        <div className="text-2xl font-semibold mb-2">{result.metadata_summary.posting_pattern}</div>
                                        <div className="text-xs text-slate-500">
                                            Most active: {result.metadata_summary.most_active_hour}:00
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recent Posts */}
                    {result.posts && result.posts.length > 0 && (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                            <h3 className="mb-4">Recent Posts (Sample)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {result.posts.slice(0, 6).map((post, idx) => (
                                    <div key={idx} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-500">
                                                {new Date(post.timestamp).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-400">
                                                {post.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-300 mb-3 line-clamp-2">{post.caption}</p>

                                        {post.metadata && (
                                            <div className="space-y-1">
                                                {post.metadata.has_location && post.metadata.location && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <MapPin className="w-3 h-3 text-red-400" />
                                                        {post.metadata.location.name}
                                                    </div>
                                                )}
                                                {post.metadata.has_device_info && post.metadata.device && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                                        <Smartphone className="w-3 h-3" />
                                                        {post.metadata.device.model}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex gap-4 mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
                                            <span>❤️ {post.likes}</span>
                                            <span>💬 {post.comments}</span>
                                            <span>🔄 {post.shares}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Panel */}
            {!result && (
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <h3 className="mb-4">What We Extract</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="p-4 bg-slate-800/30 rounded-lg">
                            <TrendingUp className="w-8 h-8 mb-3 text-blue-400" />
                            <div className="text-slate-300 mb-2 font-medium">Profile Analytics</div>
                            <div className="text-slate-500">
                                Followers, posts, engagement rates, verification status, and account age
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg">
                            <MapPin className="w-8 h-8 mb-3 text-red-400" />
                            <div className="text-slate-300 mb-2 font-medium">Metadata Extraction</div>
                            <div className="text-slate-500">
                                GPS coordinates, timestamps, device information, and EXIF data from posts
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg">
                            <AlertTriangle className="w-8 h-8 mb-3 text-yellow-400" />
                            <div className="text-slate-300 mb-2 font-medium">Risk Assessment</div>
                            <div className="text-slate-500">
                                Privacy exposure score, vulnerability analysis, and security recommendations
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
