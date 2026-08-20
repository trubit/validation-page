import React from 'react';
import type { AuthMode } from '../types/auth';

interface AuthSwitchProps {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
}

export const AuthSwitch: React.FC<AuthSwitchProps> = ({ mode, onSwitch }) => {
  const isLogin = mode === 'login';

  return (
    <div className="auth-switch-container">
      <span className="auth-switch-text">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
      </span>{' '}
      <button
        type="button"
        className="auth-switch-button"
        onClick={() => onSwitch(isLogin ? 'signup' : 'login')}
      >
        {isLogin ? 'Create one' : 'Sign in'}
      </button>
    </div>
  );
};
