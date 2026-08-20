import { describe, expect, it, beforeEach } from 'vitest';
import { authService } from './authService';

describe('AuthService Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('login (mock execution mode)', () => {
    it('successfully logs in with valid credentials', async () => {
      const response = await authService.login({
        email: 'user@truson.io',
        password: 'validpassword123',
        rememberMe: true,
      });

      expect(response.success).toBe(true);
      expect(response.token).toBeDefined();
      expect(response.user?.email).toBe('user@truson.io');
      expect(authService.getRememberedEmail()).toBe('user@truson.io');
    });

    it('throws error for wrong password', async () => {
      await expect(
        authService.login({
          email: 'user@truson.io',
          password: 'wrongpassword',
          rememberMe: false,
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('throws error for rate-limited blocked account', async () => {
      await expect(
        authService.login({
          email: 'blocked@example.com',
          password: 'anypassword',
          rememberMe: false,
        })
      ).rejects.toThrow('Too many failed login attempts.');
    });
  });

  describe('register (mock execution mode)', () => {
    it('successfully registers a new account', async () => {
      const response = await authService.register({
        fullName: 'Test User',
        email: 'newuser@truson.io',
        password: 'Password123!',
        agreeToTerms: true,
      });

      expect(response.success).toBe(true);
      expect(response.user?.fullName).toBe('Test User');
    });

    it('throws error for existing email', async () => {
      await expect(
        authService.register({
          fullName: 'Test User',
          email: 'exists@example.com',
          password: 'Password123!',
          agreeToTerms: true,
        })
      ).rejects.toThrow('An account with this email address already exists.');
    });
  });

  describe('forgotPassword', () => {
    it('sends reset email instructions', async () => {
      const response = await authService.forgotPassword({ email: 'user@truson.io' });
      expect(response.success).toBe(true);
      expect(response.message).toContain('Password reset instructions have been sent');
    });
  });
});
