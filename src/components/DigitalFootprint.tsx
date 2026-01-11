import { useState } from 'react';
import { Search, MapPin, Calendar, Link as LinkIcon, MessageSquare, Image, Code, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { API_ENDPOINTS } from '../config';

type Platform = 'all' | 'social' | 'forums' | 'repos' | 'news' | 'dark-web';

interface FootprintItem {
  id: string | number;
  platform: string;
  type: string;
  content: string;
  timestamp: string;
  url: string;
  location: string | null;
  risk: string;
  tags: string[];
}

const footprintData = [
  {
    id: 1,
    platform: 'Twitter',
    type: 'social',
    content: 'User posted about attending security conference in San Francisco',
    timestamp: '2024-12-15 14:23',
    url: 'https://twitter.com/...',
    location: 'San Francisco, CA',
    risk: 'low',
    tags: ['location', 'event'],
  },
  {
    id: 2,
    platform: 'LinkedIn',
    type: 'social',
    content: 'Profile update: Changed job title to Senior Security Engineer at TechCorp',
    timestamp: '2024-12-14 09:15',
    url: 'https://linkedin.com/...',
    location: null,
    risk: 'low',
    tags: ['employment', 'professional'],
  },
  {
    id: 3,
    platform: 'GitHub',
    type: 'repos',
    content: 'Committed code to repository "osint-tools" - email exposed in commit metadata',
    timestamp: '2024-12-13 22:47',
    url: 'https://github.com/...',
    location: null,
    risk: 'medium',
    tags: ['pii', 'email'],
  },
  {
    id: 4,
    platform: 'Pastebin',
    type: 'forums',
    content: 'Email found in leaked database dump - password hash included',
    timestamp: '2024-12-12 03:21',
    url: 'https://pastebin.com/...',
    location: null,
    risk: 'high',
    tags: ['leak', 'credentials', 'breach'],
  },
  {
    id: 5,
    platform: 'Reddit',
    type: 'forums',
    content: 'Username mentioned in r/cybersecurity discussion about OSINT tools',
    timestamp: '2024-12-11 18:32',
    url: 'https://reddit.com/...',
    location: null,
    risk: 'low',
    tags: ['mention', 'discussion'],
  },
  {
    id: 6,
    platform: 'Instagram',
    type: 'social',
    content: 'Photo posted revealing home address in background street sign',
    timestamp: '2024-12-10 16:45',
    url: 'https://instagram.com/...',
    location: 'Portland, OR',
    risk: 'high',
    tags: ['location', 'pii', 'photo'],
  },
  {
    id: 7,
    platform: 'Dark Web Forum',
    type: 'dark-web',
    content: 'User credentials listed for sale on underground marketplace',
    timestamp: '2024-12-09 01:14',
    url: '[TOR Address]',
    location: null,
    risk: 'critical',
    tags: ['credentials', 'marketplace', 'threat'],
  },
  {
    id: 8,
    platform: 'Tech News Site',
    type: 'news',
    content: 'Quoted as cybersecurity expert in article about AI security',
    timestamp: '2024-12-08 11:20',
    url: 'https://technews.com/...',
    location: null,
    risk: 'low',
    tags: ['media', 'public'],
  },
];

export function DigitalFootprint() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [osintData, setOsintData] = useState<any[]>(footprintData);
  const [linkedAssets, setLinkedAssets] = useState([
    { type: 'email', value: 'alex@investigator.io', label: 'Primary Email' },
    { type: 'twitter', value: '@alex_osint', label: 'Work Social' }
  ]);
  const [newAsset, setNewAsset] = useState({ type: 'email', value: '' });

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.OSINT_SEARCH(searchQuery));
      if (!response.ok) throw new Error('Search request failed');
      const data = await response.json();
      if (data.status === 'success') {
        const mappedData: FootprintItem[] = data.digital_footprint.map((item: any, idx: number) => ({
          id: `real-${idx}`,
          platform: item.platform,
          type: 'social',
          content: item.risk_description,
          timestamp: new Date().toISOString().split('T')[0],
          url: '#',
          location: null,
          risk: item.risk_level.toLowerCase() as FootprintItem['risk'],
          tags: [item.platform.toLowerCase()]
        }));
        setOsintData(mappedData);
      }
    } catch (error) {
      console.error('OSINT Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAsset = () => {
    if (!newAsset.value) return;
    setLinkedAssets([...linkedAssets, { ...newAsset, label: `${newAsset.type === 'email' ? 'Gmail' : 'Social'} Account` }]);
    setNewAsset({ ...newAsset, value: '' });
    // In a real demo, we'd call /profile/link here
  };

  const filteredData = osintData.filter((item: FootprintItem) => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || item.type === selectedPlatform;
    const matchesRisk = selectedRisk === 'all' || item.risk === selectedRisk;
    return matchesSearch && matchesPlatform && matchesRisk;
  });

  const stats = {
    total: osintData.length,
    critical: osintData.filter((i: FootprintItem) => i.risk === 'critical').length,
    high: osintData.filter((i: FootprintItem) => i.risk === 'high').length,
    medium: osintData.filter((i: FootprintItem) => i.risk === 'medium').length,
    low: osintData.filter((i: FootprintItem) => i.risk === 'low').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Digital Footprint Monitor</h2>
        <p className="text-slate-400">
          Comprehensive tracking of online presence across platforms and data sources
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl font-semibold text-slate-100">{stats.total}</div>
          <div className="text-sm text-slate-400 mt-1">Total Findings</div>
        </div>
        <div className="bg-slate-900/50 border border-red-500/20 rounded-xl p-4">
          <div className="text-2xl font-semibold text-red-400">{stats.critical}</div>
          <div className="text-sm text-slate-400 mt-1">Critical</div>
        </div>
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-4">
          <div className="text-2xl font-semibold text-orange-400">{stats.high}</div>
          <div className="text-sm text-slate-400 mt-1">High Risk</div>
        </div>
        <div className="bg-slate-900/50 border border-yellow-500/20 rounded-xl p-4">
          <div className="text-2xl font-semibold text-yellow-400">{stats.medium}</div>
          <div className="text-sm text-slate-400 mt-1">Medium Risk</div>
        </div>
        <div className="bg-slate-900/50 border border-green-500/20 rounded-xl p-4">
          <div className="text-2xl font-semibold text-green-400">{stats.low}</div>
          <div className="text-sm text-slate-400 mt-1">Low Risk</div>
        </div>
      </div>

      {/* Asset Linking - NEW SECTION */}
      <div className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-6 shadow-lg shadow-blue-500/5">
        <h3 className="text-blue-400 mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          Link Social Accounts & Identity Assets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <select
                value={newAsset.type}
                onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                className="bg-slate-800 border-slate-700 rounded-lg px-3 text-sm"
              >
                <option value="email">Gmail/Email</option>
                <option value="twitter">Twitter/X</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              <input
                type="text"
                placeholder="Asset identifier (email or @handle)"
                value={newAsset.value}
                onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
                className="flex-1 bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-sm"
              />
              <Button onClick={addAsset} size="sm">Link Asset</Button>
            </div>
            <p className="text-xs text-slate-500 italic">
              Linking assets allows BlueRayScan to proactively monitor your digital risk across different users and platforms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {linkedAssets.map((asset, idx) => (
              <div key={idx} className="bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 flex items-center gap-2">
                <span className="text-xs text-blue-400 font-medium capitalize">{asset.type}:</span>
                <span className="text-xs text-slate-300">{asset.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Manual Footprint Trace</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter email to trace..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} variant="secondary">
                {loading ? 'Searching...' : 'Deep Scan'}
              </Button>
            </div>
          </div>

          {/* Platform Filter */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Platform Type</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="social">Social Media</option>
              <option value="forums">Forums & Boards</option>
              <option value="repos">Code Repositories</option>
              <option value="news">News & Media</option>
              <option value="dark-web">Dark Web</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Risk Level</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="mb-4">Activity Timeline ({filteredData.length} items)</h3>
        <div className="space-y-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              {/* Risk Indicator */}
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${item.risk === 'critical' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                  item.risk === 'high' ? 'bg-orange-500' :
                    item.risk === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                  }`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-100">{item.platform}</span>
                      <span className={`px-2 py-0.5 text-xs rounded ${item.risk === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        item.risk === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          item.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                        {item.risk.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300">{item.content}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>View Source</span>
                  </a>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded border border-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PII Exposure Warning */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
          <div>
            <h3 className="text-orange-400 mb-2">PII Exposure Detected</h3>
            <p className="text-slate-300 text-sm mb-3">
              Multiple instances of personally identifiable information have been found across platforms:
            </p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Email addresses exposed in 3 locations</li>
              <li>• Physical location visible in 2 social media posts</li>
              <li>• Phone number found in 1 data breach</li>
              <li>• Employment information publicly available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
