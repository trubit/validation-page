import React from 'react';

export const AuthDivider: React.FC = () => {
  return (
    <div className="auth-divider" role="separator" aria-label="Or continue with">
      <div className="auth-divider-line" />
      <span className="auth-divider-text">OR</span>
      <div className="auth-divider-line" />
    </div>
  );
};
