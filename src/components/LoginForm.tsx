import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import type { FormErrors, LoginFormData } from '../types/auth';
import { validateLoginForm } from '../utils/validation';
import { authService } from '../services/authService';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { PrimaryButton } from './PrimaryButton';
import { SocialAuthButton } from './SocialAuthButton';
import { AuthDivider } from './AuthDivider';
import { AuthSwitch } from './AuthSwitch';

interface LoginFormProps {
  onSwitchMode: (mode: 'signup') => void;
  onOpenForgotPassword: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchMode,
  onOpenForgotPassword,
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const rememberedEmail = authService.getRememberedEmail();
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

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

    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await authService.login(formData);
      onSuccess(response.message || 'Welcome back to TRUSON!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during sign in.';
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
        <span className="auth-eyebrow">ENTERPRISE IDENTITY PORTAL</span>
        <h1 className="auth-heading">Welcome back.</h1>
        <p className="auth-subheading">Access your secure workspace and infrastructure.</p>
      </div>

      {errors.general && (
        <div className="form-alert-error" role="alert">
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <AuthInput
          id="email"
          type="email"
          label="Work Email Address"
          placeholder="you@company.com"
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
          placeholder="••••••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
        />

        <div className="form-options-row">
          <label className="checkbox-label" htmlFor="rememberMe">
            <input
              id="rememberMe"
              type="checkbox"
              className="form-checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember this device</span>
          </label>

          <button
            type="button"
            className="forgot-password-link"
            onClick={onOpenForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <PrimaryButton isLoading={isLoading} showArrow>
          Sign in to Workspace
        </PrimaryButton>
      </form>

      <AuthDivider />

      <SocialAuthButton onClick={handleGoogleAuth} isLoading={isLoading} />

      <AuthSwitch mode="login" onSwitch={() => onSwitchMode('signup')} />
    </div>
  );
};
