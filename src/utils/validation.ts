import type { FormErrors, LoginFormData, SignupFormData } from '../types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email address is required.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return undefined;
}

export function validatePassword(password: string, isSignup = false): string | undefined {
  if (!password) {
    return 'Password is required.';
  }
  if (isSignup && password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return undefined;
}

export function validateFullName(fullName: string): string | undefined {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return 'Full name is required.';
  }
  if (trimmed.length < 2) {
    return 'Please enter your full name.';
  }
  return undefined;
}

export function validateLoginForm(data: LoginFormData): FormErrors {
  const errors: FormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password, false);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateSignupForm(data: SignupFormData): FormErrors {
  const errors: FormErrors = {};

  const nameError = validateFullName(data.fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password, true);
  if (passwordError) errors.password = passwordError;

  if (!data.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and privacy policy.';
  }

  return errors;
}
