import { useEffect, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { calculatePasswordStrength, checkPasswordBreach, PasswordStrengthResult } from '../../utils/passwordStrength';
import { Progress } from '../ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [result, setResult] = useState<PasswordStrengthResult | null>(null);
  const [isBreached, setIsBreached] = useState(false);
  const [checkingBreach, setCheckingBreach] = useState(false);

  useEffect(() => {
    if (!password) {
      setResult(null);
      setIsBreached(false);
      return;
    }

    const strengthResult = calculatePasswordStrength(password);
    setResult(strengthResult);

    // Check for breaches (debounced)
    if (password.length >= 8) {
      setCheckingBreach(true);
      const timer = setTimeout(() => {
        checkPasswordBreach(password).then((breached) => {
          setIsBreached(breached);
          setCheckingBreach(false);
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [password]);

  if (!password || !result) return null;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'bg-red-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getTextColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-400';
      case 'yellow':
        return 'text-yellow-400';
      case 'blue':
        return 'text-blue-400';
      case 'green':
        return 'text-green-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Password Strength</span>
          <span className={`capitalize ${getTextColorClass(result.color)}`}>
            {result.strength}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getColorClass(result.color)}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1 ${result.requirements.minLength ? 'text-green-400' : 'text-slate-500'}`}>
          {result.requirements.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center gap-1 ${result.requirements.hasUppercase ? 'text-green-400' : 'text-slate-500'}`}>
          {result.requirements.hasUppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Uppercase letter</span>
        </div>
        <div className={`flex items-center gap-1 ${result.requirements.hasNumber ? 'text-green-400' : 'text-slate-500'}`}>
          {result.requirements.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Number</span>
        </div>
        <div className={`flex items-center gap-1 ${result.requirements.hasSpecial ? 'text-green-400' : 'text-slate-500'}`}>
          {result.requirements.hasSpecial ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>Special character</span>
        </div>
      </div>

      {/* Breach warning */}
      {checkingBreach && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <span>Checking password database...</span>
        </div>
      )}
      
      {!checkingBreach && isBreached && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
          <AlertCircle className="w-3 h-3" />
          <span>This password was found in a data breach. Choose a different one.</span>
        </div>
      )}
    </div>
  );
}
