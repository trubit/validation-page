import React, { useState } from 'react';
import { Mail, User } from 'lucide-react';
import type { FormErrors, SignupFormData } from '../types/auth';
import { validateSignupForm } from '../utils/validation';
import { authService } from '../services/authService';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { PrimaryButton } from './PrimaryButton';
import { SocialAuthButton } from './SocialAuthButton';
import { AuthDivider } from './AuthDivider';
import { AuthSwitch } from './AuthSwitch';

interface SignupFormProps {
  onSwitchMode: (mode: 'login') => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchMode,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));

    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSignupForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      onSuccess(response.message || 'Account successfully created!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrors({ general: message });
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await authService.initiateGoogleAuth();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed.';
      onError(message);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <span className="auth-eyebrow">START YOUR 14-DAY UNLIMITED TRIAL</span>
        <h1 className="auth-heading">Create your account.</h1>
        <p className="auth-subheading">Deploy enterprise-grade identity controls in under 5 minutes.</p>
      </div>

      {errors.general && (
        <div className="form-alert-error" role="alert">
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <AuthInput
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="e.g. Alex Morgan"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={<User size={18} aria-hidden="true" />}
          autoComplete="name"
          required
        />

        <AuthInput
          id="email"
          type="email"
          label="Work Email Address"
          placeholder="alex@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={18} aria-hidden="true" />}
          autoComplete="email"
          required
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
          required
        />

        <div className="form-options-single">
          <label className="checkbox-label" htmlFor="agreeToTerms">
            <input
              id="agreeToTerms"
              type="checkbox"
              className="form-checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <span>
              I accept TRUSON's{' '}
              <a href="#terms" className="legal-link" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="legal-link" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="field-error" role="alert">
              {errors.agreeToTerms}
            </p>
          )}
        </div>

        <PrimaryButton isLoading={isLoading} showArrow>
          Create Enterprise Account
        </PrimaryButton>
      </form>

      <AuthDivider />

      <SocialAuthButton onClick={handleGoogleAuth} isLoading={isLoading} />

      <AuthSwitch mode="signup" onSwitch={() => onSwitchMode('login')} />
    </div>
  );
};
