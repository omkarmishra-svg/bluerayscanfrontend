import { useState, useEffect } from 'react';
import { Shield, ChevronRight, Activity, Zap, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { AnimatedBackground } from './AnimatedBackground';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setLogoVisible(true), 300);
    setTimeout(() => setTextVisible(true), 800);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Animated Logo */}
        <div
          className={`mb-8 flex justify-center transition-all duration-1000 ${
            logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 flex items-center justify-center border border-white/20 shadow-2xl">
              <Shield className="w-16 h-16 text-white animate-pulse" />
            </div>
            {/* Scanning lines effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute h-1 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-scan" />
            </div>
          </div>
        </div>

        {/* Title with glitch effect */}
        <div
          className={`mb-4 transition-all duration-1000 delay-200 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-6xl mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-glitch" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            DIGITAL SHADOW MAPPER
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </div>

        {/* Subtitle */}
        <p
          className={`text-xl text-slate-300 mb-8 transition-all duration-1000 delay-300 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Access Digital Intelligence Platform
        </p>

        {/* Features */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 transition-all duration-1000 delay-400 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/60 transition-all hover:scale-105">
            <Activity className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
            <p className="text-sm text-slate-300">Real-Time OSINT</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/60 transition-all hover:scale-105">
            <Zap className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
            <p className="text-sm text-slate-300">AI-Powered Analysis</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/60 transition-all hover:scale-105">
            <Globe className="w-8 h-8 text-cyan-400 mb-2 mx-auto" />
            <p className="text-sm text-slate-300">Global Intelligence</p>
          </div>
        </div>

        {/* Enter Button */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button
            onClick={onEnter}
            size="lg"
            className="relative group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-6 text-lg overflow-hidden border border-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Enter Credentials
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </div>

        {/* Security Badge */}
        <div
          className={`mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 transition-all duration-1000 delay-600 ${
            textVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>🔒 256-bit Encrypted Connection</span>
        </div>

        {/* Tagline */}
        <p
          className={`mt-6 text-sm text-slate-500 italic transition-all duration-1000 delay-700 ${
            textVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          "Your Digital Footprint Reveals More Than You Think..."
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(3200%); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          33% { transform: translate(-2px, 2px); }
          66% { transform: translate(2px, -2px); }
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        
        .animate-glitch {
          animation: glitch 3s infinite;
        }
      `}</style>
    </div>
  );
}
