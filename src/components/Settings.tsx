import { Save, Key, Bell, Shield, Database, Users, Mail } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Settings</h2>
        <p className="text-slate-400">
          Configure system preferences, integrations, and security options
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-slate-400" />
          <h3>Profile & Identity</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Monitored Identities</label>
            <p className="text-xs text-slate-500 mb-2">
              Add usernames, email addresses, and other identifiers to monitor
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="@username"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-600">
                  @johndoe
                  <button className="ml-2 text-slate-500 hover:text-red-400">×</button>
                </span>
                <span className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-600">
                  john.doe@email.com
                  <button className="ml-2 text-slate-500 hover:text-red-400">×</button>
                </span>
                <span className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-600">
                  John Doe (Full Name)
                  <button className="ml-2 text-slate-500 hover:text-red-400">×</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-slate-400" />
          <h3>API Configuration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Twitter API Key</label>
            <input
              type="password"
              placeholder="••••••••••••••••"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">GitHub Personal Access Token</label>
            <input
              type="password"
              placeholder="ghp_••••••••••••••••"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Custom API Endpoints</label>
            <textarea
              placeholder="Enter custom OSINT API endpoints (one per line)"
              rows={3}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-400 font-medium mb-1">Security Notice</p>
                <p className="text-slate-300">
                  API keys are encrypted and stored securely. Never share your credentials. 
                  This application is designed for ethical OSINT research only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-slate-400" />
          <h3>Notifications & Alerts</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Email Notifications</div>
              <div className="text-sm text-slate-400">Receive alerts via email</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Critical Threat Alerts</div>
              <div className="text-sm text-slate-400">Immediate notifications for critical findings</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Daily Digest</div>
              <div className="text-sm text-slate-400">Summary of daily findings and activity</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Weekly Reports</div>
              <div className="text-sm text-slate-400">Automated weekly intelligence reports</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Notification Email
            </label>
            <input
              type="email"
              placeholder="alerts@example.com"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-slate-400" />
          <h3>Data & Privacy</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Data Retention Period
            </label>
            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="forever">Indefinitely</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Automatic Data Cleanup</div>
              <div className="text-sm text-slate-400">Remove old findings based on retention policy</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Anonymize Stored Data</div>
              <div className="text-sm text-slate-400">Hash sensitive information in database</div>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <div className="pt-4 border-t border-slate-700">
            <button className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2">
              <span>Export All Data</span>
            </button>
            <button className="mt-2 text-red-400 hover:text-red-300 text-sm flex items-center gap-2">
              <span>Delete All Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-slate-400" />
          <h3>Security & Access</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Change Password
            </label>
            <div className="space-y-2">
              <input
                type="password"
                placeholder="Current password"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Two-Factor Authentication</div>
              <div className="text-sm text-slate-400">Add extra security to your account</div>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
            <div>
              <div className="text-slate-100">Session Timeout</div>
              <div className="text-sm text-slate-400">Auto-logout after period of inactivity</div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 bg-slate-800 border-slate-700 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </div>

      {/* Legal & Ethics Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-blue-400 mb-3">Ethical Use & Legal Compliance</h3>
        <p className="text-slate-300 text-sm mb-3">
          This OSINT intelligence system is designed for legitimate security research, 
          threat intelligence, and protective monitoring purposes only.
        </p>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Only collect data from publicly available sources</li>
          <li>• Respect privacy laws and regulations (GDPR, CCPA, etc.)</li>
          <li>• Do not use for stalking, harassment, or malicious purposes</li>
          <li>• Obtain proper authorization for organizational monitoring</li>
          <li>• This tool is NOT intended for collecting PII or sensitive personal data</li>
          <li>• Follow responsible disclosure practices for discovered vulnerabilities</li>
        </ul>
      </div>
    </div>
  );
}
