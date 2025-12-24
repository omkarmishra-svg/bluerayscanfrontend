import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPassword } from './ForgotPassword';

type AuthView = 'welcome' | 'login' | 'signup' | 'forgot-password';

interface AuthContainerProps {
  onAuthenticated: () => void;
}

export function AuthContainer({ onAuthenticated }: AuthContainerProps) {
  const [currentView, setCurrentView] = useState<AuthView>('welcome');

  return (
    <>
      {currentView === 'welcome' && (
        <WelcomeScreen onEnter={() => setCurrentView('login')} />
      )}
      {currentView === 'login' && (
        <LoginForm
          onLoginSuccess={onAuthenticated}
          onSignUpClick={() => setCurrentView('signup')}
          onForgotPasswordClick={() => setCurrentView('forgot-password')}
        />
      )}
      {currentView === 'signup' && (
        <SignUpForm
          onSignUpSuccess={onAuthenticated}
          onBackToLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPassword onBackToLogin={() => setCurrentView('login')} />
      )}
    </>
  );
}
