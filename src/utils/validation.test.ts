import { describe, expect, it } from 'vitest';
import {
  validateEmail,
  validateFullName,
  validateLoginForm,
  validatePassword,
  validateSignupForm,
} from './validation';

describe('Validation Utility Functions', () => {
  describe('validateEmail', () => {
    it('returns error when email is empty', () => {
      expect(validateEmail('')).toBe('Email address is required.');
      expect(validateEmail('   ')).toBe('Email address is required.');
    });

    it('returns error for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address.');
      expect(validateEmail('user@')).toBe('Please enter a valid email address.');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address.');
    });

    it('returns undefined for valid emails', () => {
      expect(validateEmail('user@example.com')).toBeUndefined();
      expect(validateEmail('test.user+tag@sub.domain.co')).toBeUndefined();
    });
  });

  describe('validatePassword', () => {
    it('returns error when password is empty', () => {
      expect(validatePassword('')).toBe('Password is required.');
    });

    it('validates minimum length for signup mode', () => {
      expect(validatePassword('1234567', true)).toBe('Password must be at least 8 characters long.');
      expect(validatePassword('12345678', true)).toBeUndefined();
    });

    it('allows shorter password in login mode', () => {
      expect(validatePassword('12345', false)).toBeUndefined();
    });
  });

  describe('validateFullName', () => {
    it('returns error when full name is empty or less than 2 characters', () => {
      expect(validateFullName('')).toBe('Full name is required.');
      expect(validateFullName('a')).toBe('Please enter your full name.');
    });

    it('returns undefined for valid names', () => {
      expect(validateFullName('Jane Doe')).toBeUndefined();
    });
  });

  describe('validateLoginForm', () => {
    it('returns errors for invalid input', () => {
      const errors = validateLoginForm({ email: 'bad', password: '' });
      expect(errors.email).toBe('Please enter a valid email address.');
      expect(errors.password).toBe('Password is required.');
    });

    it('returns empty object for valid input', () => {
      const errors = validateLoginForm({ email: 'valid@example.com', password: 'secretpassword' });
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  describe('validateSignupForm', () => {
    it('requires terms agreement', () => {
      const errors = validateSignupForm({
        fullName: 'Alex Smith',
        email: 'alex@example.com',
        password: 'Password123!',
        agreeToTerms: false,
      });
      expect(errors.agreeToTerms).toBe('You must agree to the terms and privacy policy.');
    });
  });
});
