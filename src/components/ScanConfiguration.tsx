import { useState } from 'react';
import { Plus, Trash2, Play, Pause, Settings, Globe, Twitter, Github, Linkedin, Instagram, Youtube } from 'lucide-react';

type ScanFrequency = 'realtime' | 'hourly' | 'daily' | 'weekly';

type Monitor = {
  id: number;
  name: string;
  platform: string;
  query: string;
  frequency: ScanFrequency;
  active: boolean;
  lastScan: string;
  findings: number;
};

const initialMonitors: Monitor[] = [
  {
    id: 1,
    name: 'Twitter Mentions',
    platform: 'twitter',
    query: '@username OR "Full Name"',
    frequency: 'realtime',
    active: true,
    lastScan: '2 min ago',
    findings: 47,
  },
  {
    id: 2,
    name: 'GitHub Activity',
    platform: 'github',
    query: 'user:username OR email:user@email.com',
    frequency: 'hourly',
    active: true,
    lastScan: '15 min ago',
    findings: 23,
  },
  {
    id: 3,
    name: 'LinkedIn Profile',
    platform: 'linkedin',
    query: 'Full Name AND Company',
    frequency: 'daily',
    active: true,
    lastScan: '3 hours ago',
    findings: 12,
  },
  {
    id: 4,
    name: 'Paste Sites',
    platform: 'pastebin',
    query: 'email@domain.com OR username',
    frequency: 'hourly',
    active: false,
    lastScan: '1 day ago',
    findings: 5,
  },
  {
    id: 5,
    name: 'Dark Web Forums',
    platform: 'dark-web',
    query: 'username OR email OR "Full Name"',
    frequency: 'daily',
    active: true,
    lastScan: '6 hours ago',
    findings: 2,
  },
];

const platformIcons: Record<string, any> = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  pastebin: Globe,
  'dark-web': Globe,
};

export function ScanConfiguration() {
  const [monitors, setMonitors] = useState<Monitor[]>(initialMonitors);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleMonitor = (id: number) => {
    setMonitors(monitors.map(m =>
      m.id === id ? { ...m, active: !m.active } : m
    ));
  };

  const deleteMonitor = (id: number) => {
    setMonitors(monitors.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Scan Configuration</h2>
          <p className="text-slate-400">
            Configure automated monitoring and scanning rules across platforms
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Monitor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl font-semibold text-slate-100">
            {monitors.filter(m => m.active).length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Active Monitors</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl font-semibold text-slate-100">
            {monitors.length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Total Monitors</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl font-semibold text-slate-100">
            {monitors.reduce((sum, m) => sum + m.findings, 0)}
          </div>
          <div className="text-sm text-slate-400 mt-1">Total Findings</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-2xl font-semibold text-green-400">
            {monitors.filter(m => m.active && m.frequency === 'realtime').length}
          </div>
          <div className="text-sm text-slate-400 mt-1">Real-time Scans</div>
        </div>
      </div>

      {/* Monitors List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3>Active Monitors</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {monitors.map((monitor) => {
            const PlatformIcon = platformIcons[monitor.platform] || Globe;
            return (
              <div key={monitor.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${
                    monitor.active ? 'bg-blue-500/20' : 'bg-slate-700/50'
                  }`}>
                    <PlatformIcon className={`w-6 h-6 ${
                      monitor.active ? 'text-blue-400' : 'text-slate-500'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-slate-100">{monitor.name}</h4>
                        <p className="text-sm text-slate-400 mt-1">
                          Platform: <span className="text-slate-300">{monitor.platform}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleMonitor(monitor.id)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            monitor.active
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-slate-700 text-slate-400 border border-slate-600'
                          }`}
                        >
                          {monitor.active ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => deleteMonitor(monitor.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Query */}
                    <div className="p-3 bg-slate-800/50 rounded-lg mb-3 font-mono text-sm text-slate-300">
                      {monitor.query}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Frequency:</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          monitor.frequency === 'realtime'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {monitor.frequency}
                        </span>
                      </div>
                      <div className="text-slate-500">
                        Last scan: <span className="text-slate-400">{monitor.lastScan}</span>
                      </div>
                      <div className="text-slate-500">
                        Findings: <span className="text-slate-100">{monitor.findings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-slate-400" />
          <h3>Global Scan Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Default Scan Frequency
            </label>
            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Data Retention Period
            </label>
            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="text-slate-100">Enable automatic threat detection</div>
                <div className="text-sm text-slate-400">
                  Automatically analyze findings for potential threats using ML models
                </div>
              </div>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="text-slate-100">Send real-time alerts</div>
                <div className="text-sm text-slate-400">
                  Receive notifications when high-priority threats are detected
                </div>
              </div>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="text-slate-100">Include dark web monitoring</div>
                <div className="text-sm text-slate-400">
                  Scan TOR hidden services and dark web forums (requires additional configuration)
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* API Integration Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-blue-400 mb-3">API Integration Required</h3>
        <p className="text-slate-300 text-sm mb-3">
          To enable real-time monitoring across platforms, you'll need to configure API credentials:
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Twitter API (Essential, Elevated, or Academic Research access)</li>
          <li>• GitHub Personal Access Token</li>
          <li>• LinkedIn API credentials (limited availability)</li>
          <li>• Custom scrapers for forums and paste sites</li>
          <li>• TOR proxy configuration for dark web monitoring</li>
        </ul>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
          Configure API Keys
        </button>
      </div>
    </div>
  );
}
