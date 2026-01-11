import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, Chrome, Github, Zap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { MFAModal } from './MFAModal';
import { validateEmail, validatePassword } from '../../utils/authValidation';
import { generateDeviceFingerprint, addTrustedDevice } from '../../utils/deviceFingerprint';
import { API_ENDPOINTS } from '../../config';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
}

export function LoginForm({ onLoginSuccess, onSignUpClick, onForgotPasswordClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'mfa' | 'success'>('credentials');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(async () => {
      // Simple Login: Allow any valid format for hackathon ease
      if (email && password) {
        try {
          // 🚀 Strategic Twist: "Login" acts as a portal to link the email as an asset
          await fetch(API_ENDPOINTS.PROFILE_LINK + `?user_id=demo&asset_type=email&asset_value=${encodeURIComponent(email)}&label=Login%20Credential`, {
            method: 'POST'
          });
        } catch (e) {
          console.warn("Backend profile link failed (demo mode active)");
        }

        // Skip MFA for "simple" login as requested, go straight to success
        setLoginStep('success');
        setLoading(false);
        // Simulate Success Redirect
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      } else {
        setError('Please enter both email and password');
        setLoading(false);
      }
    }, 1000);
  };

  const handleMFAVerify = (code: string) => {
    setShowMFA(false);
    setLoginStep('success');

    // Save device if remember is checked
    if (rememberDevice) {
      const deviceInfo = generateDeviceFingerprint();
      addTrustedDevice(deviceInfo);
    }

    // Simulate success animation then redirect
    setTimeout(() => {
      onLoginSuccess();
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setError('');

    // Simulate OAuth Redirect/Popup
    setTimeout(async () => {
      const mockSocialEmail = `demo.${provider.toLowerCase()}@social.com`;

      try {
        // Link the social identity as an asset
        await fetch(API_ENDPOINTS.PROFILE_LINK + `?user_id=demo&asset_type=${provider.toLowerCase()}&asset_value=${encodeURIComponent(mockSocialEmail)}&label=${provider}%20Identity`, {
          method: 'POST'
        });
      } catch (e) {
        console.warn(`${provider} link failed in demo mode`);
      }

      setLoginStep('success');
      setLoading(false);

      // Redirect to dashboard
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Info */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                DIGITAL SHADOW MAPPER
              </h2>
              <div className="h-0.5 w-32 bg-gradient-to-r from-blue-500 to-transparent mt-1" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                🔍
              </div>
              <div>
                <h3 className="text-white mb-1">Multi-Platform OSINT</h3>
                <p className="text-sm text-slate-400">Track digital footprints across social media, forums, and the dark web</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                🤖
              </div>
              <div>
                <h3 className="text-white mb-1">AI-Powered Analysis</h3>
                <p className="text-sm text-slate-400">Machine learning detects deepfakes and verifies multimedia authenticity</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                🛡️
              </div>
              <div>
                <h3 className="text-white mb-1">Risk Assessment</h3>
                <p className="text-sm text-slate-400">Real-time threat detection with automated alerts and risk scoring</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                🌐
              </div>
              <div>
                <h3 className="text-white mb-1">Geolocation Intel</h3>
                <p className="text-sm text-slate-400">Advanced location tracking and IP analysis capabilities</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 p-4 bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-slate-400 mb-3">Live Demo Statistics</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl text-blue-400">1,247</div>
                <div className="text-xs text-slate-500">Active Scans</div>
              </div>
              <div>
                <div className="text-2xl text-purple-400">50K+</div>
                <div className="text-xs text-slate-500">Profiles</div>
              </div>
              <div>
                <div className="text-2xl text-red-400">3,891</div>
                <div className="text-xs text-slate-500">Threats</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="text-slate-400 italic border-l-2 border-blue-500 pl-4">
            "Your Digital Footprint Reveals More Than You Think..."
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {loginStep === 'success' ? (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-pulse" />
              </div>
              <h2 className="text-2xl text-white mb-2">Access Granted</h2>
              <p className="text-slate-400">Redirecting to dashboard...</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl text-white">Secure Access</h2>
                </div>
                <p className="text-slate-400">Enter your credentials to access the platform</p>
              </div>

              {/* Demo Credentials box removed */}

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email / Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-slate-900 border-slate-700 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-slate-900 border-slate-700 focus:border-blue-500"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberDevice}
                      onCheckedChange={(checked) => setRememberDevice(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                      Remember Device
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={onForgotPasswordClick}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white relative overflow-hidden group"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying credentials...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Access Platform
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-sm text-slate-500">OR</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  className="border-slate-700 hover:bg-slate-800"
                  disabled={loading}
                >
                  <Chrome className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('GitHub')}
                  className="border-slate-700 hover:bg-slate-800"
                  disabled={loading}
                >
                  <Github className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('SSO')}
                  className="border-slate-700 hover:bg-slate-800"
                  disabled={loading}
                >
                  <Shield className="w-4 h-4" />
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center text-sm">
                <span className="text-slate-400">Don't have an account? </span>
                <button
                  onClick={onSignUpClick}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign Up
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                <span>🔒 256-bit Encryption</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MFA Modal */}
      <MFAModal
        isOpen={showMFA}
        onClose={() => setShowMFA(false)}
        onVerify={handleMFAVerify}
        method="authenticator"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s;
        }
      `}</style>
    </div>
  );
}
