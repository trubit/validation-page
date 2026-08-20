import type { AuthResponse, ForgotPasswordFormData, LoginFormData, SignupFormData } from '../types/auth';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Simulates brief network delay for standalone mode
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  private isConfigured(): boolean {
    return Boolean(API_BASE_URL && !API_BASE_URL.includes('example.com'));
  }

  async login(credentials: LoginFormData): Promise<AuthResponse> {
    if (this.isConfigured()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email.trim(),
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw this.formatError(response.status, errorData.message);
        }

        const data: AuthResponse = await response.json();

        if (data.token) {
          try {
            localStorage.setItem('truson_jwt_token', data.token);
          } catch {
            // Ignore storage access errors
          }
        }

        if (credentials.rememberMe) {
          try {
            localStorage.setItem('truson_remembered_email', credentials.email.trim());
          } catch {
            // Ignore storage access errors
          }
        } else {
          try {
            localStorage.removeItem('truson_remembered_email');
          } catch {
            // Ignore storage access errors
          }
        }

        return data;
      } catch (err) {
        if (err instanceof Error && !err.message.includes('fetch')) {
          throw err;
        }
        throw new Error(`Unable to connect to the authentication server at ${API_BASE_URL}. Please check your connection.`);
      }
    }

    // Standalone / Demo execution mode when backend API is not configured
    await delay(600);

    if (credentials.email.toLowerCase() === 'blocked@example.com') {
      throw new Error('Too many failed login attempts.');
    }

    if (credentials.password === 'wrongpassword') {
      throw new Error('Invalid email or password.');
    }

    if (credentials.rememberMe) {
      try {
        localStorage.setItem('truson_remembered_email', credentials.email.trim());
      } catch {
        // Ignore storage access errors
      }
    } else {
      try {
        localStorage.removeItem('truson_remembered_email');
      } catch {
        // Ignore storage access errors
      }
    }

    const mockToken = 'truson_demo_jwt_token_session';
    try {
      localStorage.setItem('truson_jwt_token', mockToken);
    } catch {
      // Ignore storage access errors
    }

    return {
      success: true,
      message: 'Successfully signed in.',
      token: mockToken,
      user: {
        id: 'usr_89230192',
        email: credentials.email.trim(),
        fullName: credentials.email.split('@')[0] || 'User',
      },
    };
  }

  async register(data: SignupFormData): Promise<AuthResponse> {
    if (this.isConfigured()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: data.fullName.trim(),
            email: data.email.trim(),
            password: data.password,
            agreeToTerms: data.agreeToTerms,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw this.formatError(response.status, errorData.message);
        }

        const result: AuthResponse = await response.json();
        if (result.token) {
          try {
            localStorage.setItem('truson_jwt_token', result.token);
          } catch {
            // Ignore storage access errors
          }
        }
        return result;
      } catch (err) {
        if (err instanceof Error && !err.message.includes('fetch')) {
          throw err;
        }
        throw new Error(`Registration failed. Unable to connect to the authentication server at ${API_BASE_URL}.`);
      }
    }

    // Standalone / Demo execution mode
    await delay(600);

    if (data.email.toLowerCase() === 'exists@example.com') {
      throw new Error('An account with this email address already exists.');
    }

    const mockToken = 'truson_demo_jwt_token_session';
    try {
      localStorage.setItem('truson_jwt_token', mockToken);
    } catch {
      // Ignore storage access errors
    }

    return {
      success: true,
      message: 'Account created successfully! Welcome to TRUSON.',
      token: mockToken,
      user: {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: data.email.trim(),
        fullName: data.fullName.trim(),
      },
    };
  }

  async forgotPassword(data: ForgotPasswordFormData): Promise<AuthResponse> {
    if (this.isConfigured()) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email.trim() }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw this.formatError(response.status, errorData.message);
        }

        return await response.json();
      } catch (err) {
        if (err instanceof Error && !err.message.includes('fetch')) {
          throw err;
        }
        throw new Error(`Failed to send password reset request to ${API_BASE_URL}.`);
      }
    }

    await delay(600);
    return {
      success: true,
      message: `Password reset instructions have been sent to ${data.email.trim()}.`,
    };
  }

  async initiateGoogleAuth(): Promise<void> {
    if (GOOGLE_CLIENT_ID && this.isConfigured()) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
      return;
    }

    await delay(500);
    alert('Google OAuth flow initiated (Production requires VITE_GOOGLE_CLIENT_ID environment variable).');
  }

  getRememberedEmail(): string {
    try {
      return localStorage.getItem('truson_remembered_email') || '';
    } catch {
      return '';
    }
  }

  getToken(): string {
    try {
      return localStorage.getItem('truson_jwt_token') || '';
    } catch {
      return '';
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('truson_jwt_token');
    } catch {
      // Ignore storage errors
    }
  }

  private formatError(status: number, defaultMsg?: string): Error {
    switch (status) {
      case 400:
        return new Error(defaultMsg || 'Invalid request. Please check your input.');
      case 401:
        return new Error(defaultMsg || 'Invalid email or password.');
      case 403:
        return new Error(defaultMsg || 'Access denied. Account may be suspended.');
      case 409:
        return new Error(defaultMsg || 'An account with this email address already exists.');
      case 429:
        return new Error('Too many failed login attempts.');
      case 500:
      default:
        return new Error(defaultMsg || 'A server error occurred. Please try again.');
    }
  }
}

export const authService = new AuthService();
