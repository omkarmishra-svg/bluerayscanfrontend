import { useState, useRef, useEffect } from 'react';
import { X, Smartphone, Mail, Key, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { validateOTP } from '../../utils/authValidation';

interface MFAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  method: 'authenticator' | 'sms' | 'email';
}

export function MFAModal({ isOpen, onClose, onVerify, method }: MFAModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value].join('');
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeString: string) => {
    const validation = validateOTP(codeString);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid code');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (codeString === '123456') {
        onVerify(codeString);
      } else {
        setError('Invalid verification code');
        setLoading(false);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const getMethodInfo = () => {
    switch (method) {
      case 'authenticator':
        return {
          icon: Smartphone,
          title: 'Authenticator App',
          description: 'Enter the 6-digit code from your authenticator app',
        };
      case 'sms':
        return {
          icon: Mail,
          title: 'SMS Verification',
          description: 'Enter the code sent to your phone',
        };
      case 'email':
        return {
          icon: Mail,
          title: 'Email Verification',
          description: 'Enter the code sent to your email',
        };
    }
  };

  if (!isOpen) return null;

  const methodInfo = getMethodInfo();
  const Icon = methodInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg text-white">{methodInfo.title}</h3>
              <p className="text-sm text-slate-400">{methodInfo.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl bg-slate-800 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center animate-shake">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => handleVerify(code.join(''))}
            disabled={code.join('').length !== 6 || loading}
            className="w-full bg-blue-600 hover:bg-blue-500"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </Button>

          <button
            onClick={onClose}
            className="w-full text-sm text-slate-400 hover:text-white transition-colors"
          >
            Use a different method
          </button>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-start gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>For demo purposes, use code: <span className="text-blue-400">123456</span></p>
        </div>
      </div>

      <style>{`
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
