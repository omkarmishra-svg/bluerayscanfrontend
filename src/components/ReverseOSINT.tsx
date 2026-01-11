import { useState, useEffect } from 'react';
import { Globe, MapPin, Clock, Shield, Users, AlertTriangle, Activity } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

interface Visitor {
    id: number;
    ip: string;
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    is_suspicious: boolean;
    threat_level: string;
    accessed: string;
}

interface ThreatActor {
    fingerprint: string;
    ip_addresses: string[];
    locations: string[];
    total_visits: number;
    threat_level: string;
    first_seen: string;
    last_seen: string;
    visits: any[];
}

export function ReverseOSINT() {
    const [stats, setStats] = useState<any>(null);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [threatActors, setThreatActors] = useState<ThreatActor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'map' | 'visitors' | 'threats'>('map');

    useEffect(() => {
        loadData();
        // Refresh every 30 seconds
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            // Load all data concurrently
            const [statsRes, mapRes, threatsRes] = await Promise.all([
                fetch(API_ENDPOINTS.REVERSE_OSINT_STATS),
                fetch(API_ENDPOINTS.REVERSE_OSINT_MAP(24)),
                fetch(API_ENDPOINTS.REVERSE_OSINT_THREATS)
            ]);

            const statsData = await statsRes.json();
            const mapData = await mapRes.json();
            const threatsData = await threatsRes.json();

            setStats(statsData);
            setVisitors(mapData.visitors || []);
            setThreatActors(threatsData.threat_actors || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load reverse OSINT data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Activity className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-slate-400">Loading reverse OSINT data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl mb-2">Reverse OSINT - Visitor Tracking</h2>
                <p className="text-slate-400">
                    Monitor who's accessing your information and identify potential threat actors
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Total Visitors"
                    value={stats?.total_visitors || 0}
                    color="blue"
                />
                <StatCard
                    icon={Globe}
                    label="Countries"
                    value={stats?.countries_detected || 0}
                    color="green"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Suspicious"
                    value={stats?.suspicious_visitors || 0}
                    color="red"
                />
                <StatCard
                    icon={Shield}
                    label="Unique IPs"
                    value={stats?.unique_ips || 0}
                    color="purple"
                />
            </div>

            {/* Threat Level Distribution */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <h3 className="mb-4">Threat Level Distribution</h3>
                <div className="grid grid-cols-4 gap-4">
                    <ThreatLevelCard level="CRITICAL" count={stats?.threat_levels?.critical || 0} color="red" />
                    <ThreatLevelCard level="HIGH" count={stats?.threat_levels?.high || 0} color="orange" />
                    <ThreatLevelCard level="MEDIUM" count={stats?.threat_levels?.medium || 0} color="yellow" />
                    <ThreatLevelCard level="LOW" count={stats?.threat_levels?.low || 0} color="green" />
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-slate-800">
                <TabButton
                    active={selectedTab === 'map'}
                    onClick={() => setSelectedTab('map')}
                    icon={MapPin}
                    label="Visitor Map"
                />
                <TabButton
                    active={selectedTab === 'visitors'}
                    onClick={() => setSelectedTab('visitors')}
                    icon={Clock}
                    label="Access Logs"
                />
                <TabButton
                    active={selectedTab === 'threats'}
                    onClick={() => setSelectedTab('threats')}
                    icon={AlertTriangle}
                    label="Threat Actors"
                />
            </div>

            {/* Content based on selected tab */}
            {selectedTab === 'map' && <VisitorMap visitors={visitors} />}
            {selectedTab === 'visitors' && <VisitorLogs visitors={visitors} />}
            {selectedTab === 'threats' && <ThreatActors actors={threatActors} />}
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    const colors = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        red: 'text-red-400',
        purple: 'text-purple-400'
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${colors[color as keyof typeof colors]}`} />
                <span className="text-sm text-slate-400">{label}</span>
            </div>
            <div className="text-2xl font-semibold">{value.toLocaleString()}</div>
        </div>
    );
}

function ThreatLevelCard({ level, count, color }: any) {
    const colors = {
        red: 'bg-red-500/10 border-red-500/30 text-red-400',
        orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
        green: 'bg-green-500/10 border-green-500/30 text-green-400'
    };

    return (
        <div className={`p-4 rounded-lg border ${colors[color as keyof typeof colors]}`}>
            <div className="text-xs mb-1">{level}</div>
            <div className="text-xl font-semibold">{count}</div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${active
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );
}

function VisitorMap({ visitors }: { visitors: Visitor[] }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="mb-4">Visitor Locations (Last 24 Hours)</h3>

            {/* Mock world map visualization */}
            <div className="relative bg-slate-800/50 rounded-lg h-96 overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                    <Globe className="w-32 h-32 opacity-20" />
                </div>

                {/* Visitor markers (simplified) */}
                <div className="absolute inset-0">
                    {visitors.slice(0, 20).map((visitor, idx) => (
                        <div
                            key={visitor.id}
                            className="absolute w-3 h-3 rounded-full animate-ping"
                            style={{
                                left: `${Math.random() * 90 + 5}%`,
                                top: `${Math.random() * 80 + 10}%`,
                                backgroundColor: visitor.is_suspicious ? '#ef4444' : '#3b82f6',
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Location list */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {visitors.slice(0, 9).map((visitor) => (
                    <div key={visitor.id} className="p-3 bg-slate-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-300">{visitor.city}</span>
                            {visitor.is_suspicious && (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                        </div>
                        <div className="text-xs text-slate-500">{visitor.country}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VisitorLogs({ visitors }: { visitors: Visitor[] }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="mb-4">Access Logs</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-800 text-left">
                            <th className="pb-3 text-sm text-slate-400 font-normal">IP Address</th>
                            <th className="pb-3 text-sm text-slate-400 font-normal">Location</th>
                            <th className="pb-3 text-sm text-slate-400 font-normal">Resource</th>
                            <th className="pb-3 text-sm text-slate-400 font-normal">Time</th>
                            <th className="pb-3 text-sm text-slate-400 font-normal">Threat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitors.slice(0, 20).map((visitor) => (
                            <tr key={visitor.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                <td className="py-3 text-sm font-mono">{visitor.ip}</td>
                                <td className="py-3 text-sm text-slate-300">{visitor.city}, {visitor.country}</td>
                                <td className="py-3 text-sm text-slate-400 truncate max-w-xs">{visitor.accessed}</td>
                                <td className="py-3 text-sm text-slate-400">{new Date(visitor.timestamp).toLocaleString()}</td>
                                <td className="py-3">
                                    <span className={`text-xs px-2 py-1 rounded ${visitor.threat_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                            visitor.threat_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                                visitor.threat_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-green-500/20 text-green-400'
                                        }`}>
                                        {visitor.threat_level || 'LOW'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ThreatActors({ actors }: { actors: ThreatActor[] }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="mb-4">Identified Threat Actors</h3>

            {actors.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No threat actors identified yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {actors.map((actor, idx) => (
                        <div key={actor.fingerprint} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="text-sm text-slate-300 font-medium mb-1">
                                        Threat Actor #{idx + 1}
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">
                                        Fingerprint: {actor.fingerprint}
                                    </div>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded ${actor.threat_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        actor.threat_level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    }`}>
                                    {actor.threat_level}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                    <div className="text-slate-500 text-xs mb-1">Total Visits</div>
                                    <div className="text-slate-200 font-medium">{actor.total_visits}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs mb-1">IP Addresses</div>
                                    <div className="text-slate-200 font-medium">{actor.ip_addresses.length}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs mb-1">First Seen</div>
                                    <div className="text-slate-200 font-medium">
                                        {new Date(actor.first_seen).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs mb-1">Last Seen</div>
                                    <div className="text-slate-200 font-medium">
                                        {new Date(actor.last_seen).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {actor.locations.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-700">
                                    <div className="text-xs text-slate-500 mb-2">Locations:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {actor.locations.map((loc, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-300">
                                                {loc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
