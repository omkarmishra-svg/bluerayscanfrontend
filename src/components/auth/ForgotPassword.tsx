import { useState } from 'react';
import { Mail, ArrowLeft, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { validateEmail } from '../../utils/authValidation';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid email');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
            <CheckCircle2 className="w-10 h-10 text-green-500 animate-pulse" />
          </div>
          <h2 className="text-2xl text-white mb-2">Check Your Email</h2>
          <p className="text-slate-400 mb-6">
            We've sent password reset instructions to <strong className="text-white">{email}</strong>
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl text-white">Reset Password</h2>
          </div>
          <p className="text-slate-400">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10 bg-slate-900 border-slate-700 focus:border-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending instructions...
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </Button>
        </form>

        {/* Help text */}
        <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-sm text-slate-400">
            <strong className="text-white">Need help?</strong> Contact our support team at{' '}
            <a href="mailto:support@osint.com" className="text-blue-400 hover:text-blue-300">
              support@osint.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
