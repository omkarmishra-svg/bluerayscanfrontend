import { useState } from 'react';
import { AuthContainer } from './components/auth/AuthContainer';
import { Dashboard } from './components/Dashboard';
import { DeepfakeAnalyzer } from './components/DeepfakeAnalyzer';
import { DigitalFootprint } from './components/DigitalFootprint';
import { RiskMonitor } from './components/RiskMonitor';
import { ScanConfiguration } from './components/ScanConfiguration';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { 
  LayoutDashboard, 
  Scan, 
  Footprints, 
  Shield, 
  Settings as SettingsIcon,
  FileText,
  Search,
  LogOut,
  User,
  Info
} from 'lucide-react';
import { Button } from './components/ui/button';

type View = 'dashboard' | 'deepfake' | 'footprint' | 'risk' | 'scan' | 'reports' | 'settings' | 'about';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user] = useState({ email: 'demo@osint.com', name: 'Demo User' });

  // If not authenticated, show auth flow
  if (!isAuthenticated) {
    return <AuthContainer onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setIsAuthenticated(false);
      setCurrentView('dashboard');
    }
  };

  const navigation = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deepfake' as View, label: 'Deepfake Analysis', icon: Scan },
    { id: 'footprint' as View, label: 'Digital Footprint', icon: Footprints },
    { id: 'risk' as View, label: 'Risk Monitor', icon: Shield },
    { id: 'scan' as View, label: 'Scan Config', icon: Search },
    { id: 'reports' as View, label: 'Reports', icon: FileText },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
    { id: 'about' as View, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">OSINT Intelligence System</h1>
                <p className="text-sm text-slate-400">Autonomous Digital Footprint & Deepfake Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-sm border border-green-500/20">
                System Active
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{user.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 border-r border-slate-800 bg-slate-900/30 min-h-[calc(100vh-73px)] p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'deepfake' && <DeepfakeAnalyzer />}
          {currentView === 'footprint' && <DigitalFootprint />}
          {currentView === 'risk' && <RiskMonitor />}
          {currentView === 'scan' && <ScanConfiguration />}
          {currentView === 'reports' && <Reports />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'about' && <About />}
        </main>
      </div>
    </div>
  );
}