import type { AuthResponse, ForgotPasswordFormData, LoginFormData, SignupFormData } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Simulates network delay for mock execution mode
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

        return await response.json();
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          throw err;
        }
        throw new Error('Unable to connect to the authentication server. Please try again.');
      }
    }

    // Mock API execution for standalone demonstration
    await delay(1000);

    // Simulate rate limiting or invalid credentials
    if (credentials.email.toLowerCase() === 'blocked@example.com') {
      throw new Error('Too many failed login attempts. Please try again in 15 minutes.');
    }

    if (credentials.password === 'wrongpassword') {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    // Save remembered email safely
    if (credentials.rememberMe) {
      try {
        localStorage.setItem('truson_remembered_email', credentials.email.trim());
      } catch {
        // Ignore storage access errors in restricted iframe environments
      }
    } else {
      try {
        localStorage.removeItem('truson_remembered_email');
      } catch {
        // Ignore storage access errors
      }
    }

    return {
      success: true,
      message: 'Successfully signed in.',
      token: 'truson_mock_jwt_token_session',
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

        return await response.json();
      } catch (err) {
        if (err && typeof err === 'object' && 'message' in err) {
          throw err;
        }
        throw new Error('Registration failed due to a network issue. Please try again.');
      }
    }

    // Mock API execution
    await delay(1200);

    if (data.email.toLowerCase() === 'exists@example.com') {
      throw new Error('An account with this email address already exists.');
    }

    return {
      success: true,
      message: 'Account created successfully! Welcome to TRUSON.',
      token: 'truson_mock_jwt_token_session',
      user: {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
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
        if (err && typeof err === 'object' && 'message' in err) {
          throw err;
        }
        throw new Error('Failed to send password reset request. Please check your connection.');
      }
    }

    await delay(900);
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

    // Mock Google Auth action for preview mode
    await delay(800);
    alert('Google OAuth flow initiated (Production requires VITE_GOOGLE_CLIENT_ID environment variable).');
  }

  getRememberedEmail(): string {
    try {
      return localStorage.getItem('truson_remembered_email') || '';
    } catch {
      return '';
    }
  }

  private formatError(status: number, defaultMsg?: string): Error {
    switch (status) {
      case 400:
        return new Error(defaultMsg || 'Invalid request. Please check your input.');
      case 401:
        return new Error(defaultMsg || 'Invalid credentials. Please try again.');
      case 403:
        return new Error(defaultMsg || 'Access denied. Account may be suspended.');
      case 409:
        return new Error(defaultMsg || 'An account with this email already exists.');
      case 429:
        return new Error('Too many requests. Please wait a moment before trying again.');
      case 500:
      default:
        return new Error('A server error occurred. Our engineers have been notified.');
    }
  }
}

export const authService = new AuthService();
