import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { authService } from '../services/authService';
import { AuthInput } from './AuthInput';
import { PrimaryButton } from './PrimaryButton';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(undefined);
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      onSuccess(response.message);
      onClose();
      setEmail('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <div className="modal-header">
          <h2 id="forgot-password-title" className="modal-title">
            Reset Password
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <p className="modal-description">
          Enter the email address associated with your TRUSON account and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <AuthInput
            id="reset-email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            error={error}
            icon={<Mail size={18} aria-hidden="true" />}
            autoComplete="email"
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <PrimaryButton isLoading={isLoading} showArrow={false}>
              Send Reset Link
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
