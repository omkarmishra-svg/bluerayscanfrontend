export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email or Username is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Allow normal email OR a simple username (alphanumeric, 3+ chars)
  if (!emailRegex.test(email) && !/^[a-zA-Z0-9_-]{3,}$/.test(email)) {
    return { isValid: false, error: 'Invalid email or username format' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain an uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain a lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain a number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain a special character' };
  }

  return { isValid: true };
}

export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, - and _' };
  }

  return { isValid: true };
}

export function validateOTP(otp: string): ValidationResult {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }

  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: 'OTP must be 6 digits' };
  }

  return { isValid: true };
}
