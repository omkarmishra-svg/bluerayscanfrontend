export interface PasswordStrengthResult {
  score: number; // 0-4
  strength: 'weak' | 'fair' | 'good' | 'strong';
  color: string;
  percentage: number;
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');
  
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;

  // Character variety
  if (requirements.hasUppercase) score += 0.5;
  else feedback.push('Add uppercase letters');
  
  if (requirements.hasLowercase) score += 0.5;
  else feedback.push('Add lowercase letters');
  
  if (requirements.hasNumber) score += 0.5;
  else feedback.push('Add numbers');
  
  if (requirements.hasSpecial) score += 1;
  else feedback.push('Add special characters');

  // Common patterns penalty
  const commonPatterns = ['123', 'abc', 'password', 'qwerty', '111'];
  const lowerPassword = password.toLowerCase();
  if (commonPatterns.some(pattern => lowerPassword.includes(pattern))) {
    score -= 1;
    feedback.push('Avoid common patterns');
  }

  // Normalize score to 0-4
  score = Math.max(0, Math.min(4, score));

  let strength: 'weak' | 'fair' | 'good' | 'strong';
  let color: string;
  
  if (score < 2) {
    strength = 'weak';
    color = 'red';
  } else if (score < 3) {
    strength = 'fair';
    color = 'yellow';
  } else if (score < 3.5) {
    strength = 'good';
    color = 'blue';
  } else {
    strength = 'strong';
    color = 'green';
  }

  return {
    score,
    strength,
    color,
    percentage: (score / 4) * 100,
    feedback,
    requirements,
  };
}

export function checkPasswordBreach(password: string): Promise<boolean> {
  // Simulated breach check (in production, use HaveIBeenPwned API with k-anonymity)
  return new Promise((resolve) => {
    setTimeout(() => {
      const commonPasswords = [
        'password', '123456', 'qwerty', 'admin', 'letmein',
        'welcome', 'monkey', 'dragon', 'master', '123456789'
      ];
      resolve(commonPasswords.includes(password.toLowerCase()));
    }, 500);
  });
}
