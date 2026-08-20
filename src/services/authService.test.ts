// @vitest-environment jsdom
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { authService } from './authService';

describe('AuthService Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('successfully logs in with valid credentials and stores token and remembered email', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Successfully signed in.',
          token: 'mock_jwt_token',
          user: { id: 'usr_1', email: 'user@truson.io', fullName: 'Test User' },
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await authService.login({
        email: 'user@truson.io',
        password: 'validpassword123',
        rememberMe: true,
      });

      expect(response.success).toBe(true);
      expect(response.token).toBe('mock_jwt_token');
      expect(response.user?.email).toBe('user@truson.io');
      expect(authService.getRememberedEmail()).toBe('user@truson.io');
      expect(authService.getToken()).toBe('mock_jwt_token');
    });

    it('throws error for wrong password (401)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password.' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await expect(
        authService.login({
          email: 'user@truson.io',
          password: 'wrongpassword',
          rememberMe: false,
        })
      ).rejects.toThrow('Invalid email or password.');
    });

    it('throws error for rate-limited blocked account (429)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ message: 'Too many failed login attempts.' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      await expect(
        authService.login({
          email: 'blocked@example.com',
          password: 'anypassword',
          rememberMe: false,
        })
      ).rejects.toThrow('Too many failed login attempts.');
    });
  });

  describe('register', () => {
    it('successfully registers a new account', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Account created successfully!',
          token: 'new_user_token',
          user: { id: 'usr_2', email: 'newuser@truson.io', fullName: 'Test User' },
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await authService.register({
        fullName: 'Test User',
        email: 'newuser@truson.io',
        password: 'Password123!',
        agreeToTerms: true,
      });

      expect(response.success).toBe(true);
      expect(response.user?.fullName).toBe('Test User');
    });

    it('throws error for existing email (409)', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ message: 'An account with this email address already exists.' }),
      });
      vi.stubGlobal('fetch', mockFetch);

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
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Password reset instructions have been sent',
        }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await authService.forgotPassword({ email: 'user@truson.io' });
      expect(response.success).toBe(true);
      expect(response.message).toContain('Password reset instructions have been sent');
    });
  });
});
