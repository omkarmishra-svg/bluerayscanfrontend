import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, Eye } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const scanActivity = [
  { date: 'Mon', scans: 45, threats: 3 },
  { date: 'Tue', scans: 52, threats: 1 },
  { date: 'Wed', scans: 48, threats: 5 },
  { date: 'Thu', scans: 61, threats: 2 },
  { date: 'Fri', scans: 55, threats: 4 },
  { date: 'Sat', scans: 38, threats: 1 },
  { date: 'Sun', scans: 42, threats: 0 },
];

const platformDistribution = [
  { name: 'Social Media', value: 342, color: '#3b82f6' },
  { name: 'Forums', value: 156, color: '#8b5cf6' },
  { name: 'News Sites', value: 89, color: '#06b6d4' },
  { name: 'Dark Web', value: 23, color: '#ef4444' },
  { name: 'Code Repos', value: 67, color: '#10b981' },
];

const recentAlerts = [
  { id: 1, type: 'critical', title: 'Potential Deepfake Detected', platform: 'Twitter', time: '12 min ago', description: 'AI-generated image using target identity' },
  { id: 2, type: 'warning', title: 'Data Leak Found', platform: 'Pastebin', time: '1 hour ago', description: 'Email address found in breach dataset' },
  { id: 3, type: 'info', title: 'New Mention Detected', platform: 'Reddit', time: '3 hours ago', description: 'Username referenced in r/security' },
  { id: 4, type: 'warning', title: 'Voice Clone Suspicious', platform: 'YouTube', time: '5 hours ago', description: 'Audio analysis shows 78% similarity to target voice' },
];

export function Dashboard() {
  const [stats, setStats] = useState({
    scans: "---",
    monitors: "---",
    threats: "---",
    authentic: "---"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stats');
        const data = await response.json();
        setStats({
          scans: data.scans,
          monitors: data.monitors,
          threats: data.threats,
          authentic: data.authentic
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans"
          value={stats.scans}
          change="+12.5%"
          trend="up"
          icon={Activity}
        />
        <StatCard
          title="Active Monitors"
          value={stats.monitors}
          change="+3"
          trend="up"
          icon={Eye}
        />
        <StatCard
          title="Threats Detected"
          value={stats.threats}
          change="-8.3%"
          trend="down"
          icon={AlertTriangle}
        />
        <StatCard
          title="Verified Authentic"
          value={stats.authentic}
          change="+15.2%"
          trend="up"
          icon={CheckCircle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan Activity Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="mb-4">Scan Activity & Threat Detection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={scanActivity}>
              <defs>
                <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Area type="monotone" dataKey="scans" stroke="#3b82f6" fillOpacity={1} fill="url(#scanGradient)" />
              <Area type="monotone" dataKey="threats" stroke="#ef4444" fillOpacity={1} fill="url(#threatGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="mb-4">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {platformDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {platformDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Alerts</h3>
          <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className={`mt-1 w-2 h-2 rounded-full ${alert.type === 'critical' ? 'bg-red-500' :
                alert.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-slate-100">{alert.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{alert.time}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Platform: <span className="text-slate-400">{alert.platform}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">{title}</span>
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className="text-3xl font-semibold text-slate-100 mb-2">{value}</div>
      <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{change}</span>
      </div>
    </div>
  );
}
