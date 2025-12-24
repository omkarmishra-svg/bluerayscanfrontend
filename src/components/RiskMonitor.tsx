import { AlertTriangle, TrendingUp, Globe, Users, Lock, Eye } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const riskTrends = [
  { date: 'Dec 10', score: 45, incidents: 2 },
  { date: 'Dec 11', score: 52, incidents: 4 },
  { date: 'Dec 12', score: 68, incidents: 6 },
  { date: 'Dec 13', score: 61, incidents: 3 },
  { date: 'Dec 14', score: 55, incidents: 2 },
  { date: 'Dec 15', score: 72, incidents: 5 },
  { date: 'Dec 16', score: 78, incidents: 7 },
  { date: 'Dec 17', score: 65, incidents: 4 },
];

const exposureCategories = [
  { category: 'PII Exposure', score: 75 },
  { category: 'Location Data', score: 60 },
  { category: 'Credential Leaks', score: 85 },
  { category: 'Social Engineering', score: 45 },
  { category: 'Deepfake Risk', score: 30 },
  { category: 'Dark Web Activity', score: 90 },
];

const activeThreats = [
  {
    id: 1,
    severity: 'critical',
    title: 'Credentials Found on Dark Web Marketplace',
    description: 'Email and hashed password discovered in underground forum',
    platform: 'Dark Web',
    detectedAt: '2 hours ago',
    indicators: ['Credential Leak', 'Active Sale', 'High Traffic'],
  },
  {
    id: 2,
    severity: 'high',
    title: 'Deepfake Video Circulating on Social Media',
    description: 'AI-generated video using target likeness detected on Twitter',
    platform: 'Twitter',
    detectedAt: '5 hours ago',
    indicators: ['Deepfake', 'Viral Content', 'Impersonation'],
  },
  {
    id: 3,
    severity: 'high',
    title: 'Personal Address Exposed in Photo Metadata',
    description: 'GPS coordinates embedded in Instagram photo reveal home location',
    platform: 'Instagram',
    detectedAt: '1 day ago',
    indicators: ['PII', 'Location', 'EXIF Data'],
  },
  {
    id: 4,
    severity: 'medium',
    title: 'Email Address in Recent Data Breach',
    description: 'Found in leaked customer database from third-party service',
    platform: 'Breach Database',
    detectedAt: '2 days ago',
    indicators: ['Data Breach', 'Email Exposure'],
  },
  {
    id: 5,
    severity: 'medium',
    title: 'Suspicious Account Activity Pattern',
    description: 'Login attempts from unusual geographic locations detected',
    platform: 'Multiple Platforms',
    detectedAt: '3 days ago',
    indicators: ['Anomalous Activity', 'Geographic'],
  },
];

export function RiskMonitor() {
  const currentRiskScore = riskTrends[riskTrends.length - 1].score;
  const riskLevel = currentRiskScore >= 70 ? 'High' : currentRiskScore >= 40 ? 'Medium' : 'Low';
  const riskColor = currentRiskScore >= 70 ? 'red' : currentRiskScore >= 40 ? 'yellow' : 'green';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Risk Monitor</h2>
        <p className="text-slate-400">
          Real-time threat assessment and exposure vulnerability tracking
        </p>
      </div>

      {/* Risk Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Overall Risk Score</h3>
            <div className={`px-3 py-1.5 rounded-lg ${
              riskColor === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              riskColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {riskLevel} Risk
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className={`text-6xl font-semibold ${
              riskColor === 'red' ? 'text-red-400' :
              riskColor === 'yellow' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {currentRiskScore}
            </div>
            <div className="pb-2 text-slate-400">/ 100</div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Risk has increased by 12 points in the last 7 days
          </div>
        </div>

        <RiskMetricCard
          icon={AlertTriangle}
          label="Active Threats"
          value="5"
          color="red"
        />
        <RiskMetricCard
          icon={Eye}
          label="Monitoring Sources"
          value="847"
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="mb-4">Risk Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrends}>
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
              <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Exposure Categories */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="mb-4">Exposure Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={exposureCategories}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar name="Exposure" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Threats */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Active Threats</h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-400">Live Monitoring</span>
          </div>
        </div>
        <div className="space-y-3">
          {activeThreats.map((threat) => (
            <div
              key={threat.id}
              className={`p-5 rounded-lg border-l-4 ${
                threat.severity === 'critical'
                  ? 'bg-red-500/10 border-red-500'
                  : threat.severity === 'high'
                  ? 'bg-orange-500/10 border-orange-500'
                  : 'bg-yellow-500/10 border-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-slate-100">{threat.title}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      threat.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : threat.severity === 'high'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{threat.description}</p>
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">
                  {threat.detectedAt}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {threat.indicators.map((indicator, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-slate-800/50 text-slate-400 text-xs rounded border border-slate-700"
                    >
                      {indicator}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-slate-500">
                  Source: <span className="text-slate-400">{threat.platform}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  Investigate
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors">
                  Mark as Reviewed
                </button>
                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors">
                  False Positive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex gap-4">
          <Lock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-blue-400 mb-3">Recommended Actions</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Immediately change passwords for accounts found in credential leak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Enable 2FA on all critical accounts to prevent unauthorized access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Report deepfake content to platform moderators for removal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Review and remove location data from social media posts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Monitor dark web marketplaces for additional credential sales</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskMetricCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  const colorClass = {
    red: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
  }[color];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <Icon className={`w-8 h-8 ${colorClass} mb-3`} />
      <div className={`text-3xl font-semibold ${colorClass} mb-2`}>{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}
