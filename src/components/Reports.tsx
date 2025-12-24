import { Download, FileText, Calendar, Filter, TrendingUp } from 'lucide-react';

type Report = {
  id: number;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident';
  date: string;
  findings: number;
  threats: number;
  size: string;
};

const reports: Report[] = [
  {
    id: 1,
    title: 'Weekly Security Report - Dec 10-17',
    type: 'weekly',
    date: '2024-12-17',
    findings: 342,
    threats: 8,
    size: '2.4 MB',
  },
  {
    id: 2,
    title: 'Daily Scan Report - Dec 16',
    type: 'daily',
    date: '2024-12-16',
    findings: 48,
    threats: 2,
    size: '456 KB',
  },
  {
    id: 3,
    title: 'Incident Report: Credential Leak',
    type: 'incident',
    date: '2024-12-15',
    findings: 1,
    threats: 1,
    size: '128 KB',
  },
  {
    id: 4,
    title: 'Monthly Overview - November 2024',
    type: 'monthly',
    date: '2024-12-01',
    findings: 1247,
    threats: 23,
    size: '8.7 MB',
  },
  {
    id: 5,
    title: 'Weekly Security Report - Dec 3-10',
    type: 'weekly',
    date: '2024-12-10',
    findings: 298,
    threats: 5,
    size: '2.1 MB',
  },
  {
    id: 6,
    title: 'Incident Report: Deepfake Detection',
    type: 'incident',
    date: '2024-12-08',
    findings: 1,
    threats: 1,
    size: '892 KB',
  },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Reports & Analytics</h2>
        <p className="text-slate-400">
          Generated intelligence reports and exportable analysis data
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-6 bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-colors text-left">
          <FileText className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-slate-100 mb-2">Generate Custom Report</h3>
          <p className="text-sm text-slate-400">Create a tailored report with specific date ranges and filters</p>
        </button>

        <button className="p-6 bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-colors text-left">
          <Download className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-slate-100 mb-2">Export All Data</h3>
          <p className="text-sm text-slate-400">Download complete dataset in CSV, JSON, or PDF format</p>
        </button>

        <button className="p-6 bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-colors text-left">
          <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-slate-100 mb-2">Analytics Dashboard</h3>
          <p className="text-sm text-slate-400">View detailed analytics and trend visualizations</p>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Report Type</label>
            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="daily">Daily Reports</option>
              <option value="weekly">Weekly Reports</option>
              <option value="monthly">Monthly Reports</option>
              <option value="incident">Incident Reports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Date Range</label>
            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Threat Level</label>
            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Levels</option>
              <option value="critical">Critical Only</option>
              <option value="high">High & Above</option>
              <option value="medium">Medium & Above</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3>Generated Reports</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-6 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <h4 className="text-slate-100">{report.title}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      report.type === 'incident'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : report.type === 'monthly'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : report.type === 'weekly'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {report.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{report.date}</span>
                    </div>
                    <div>
                      Findings: <span className="text-slate-300">{report.findings}</span>
                    </div>
                    <div>
                      Threats: <span className={report.threats > 0 ? 'text-red-400' : 'text-green-400'}>
                        {report.threats}
                      </span>
                    </div>
                    <div>
                      Size: <span className="text-slate-300">{report.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    View
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Summary Preview */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="mb-4">Latest Report Summary</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Total Scans</div>
              <div className="text-2xl font-semibold text-slate-100">342</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Threats Detected</div>
              <div className="text-2xl font-semibold text-red-400">8</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Risk Score Change</div>
              <div className="text-2xl font-semibold text-yellow-400">+12</div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-slate-200 mb-3">Key Findings</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>2 instances of credential exposure found on dark web marketplaces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span>1 deepfake video detected circulating on social media platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <span>3 instances of PII exposure in public social media posts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>12 new mentions across various platforms and forums</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 mb-2">Executive Summary</h4>
            <p className="text-sm text-slate-300">
              The past week showed increased digital footprint activity with elevated risk indicators. 
              Immediate action required for credential leaks and deepfake content. Recommended 
              implementation of additional monitoring on identified high-risk platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
