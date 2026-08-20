import type { AuthResponse, ForgotPasswordFormData, LoginFormData, SignupFormData } from '../types/auth';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

class AuthService {
  private getEndpoint(path: string): string {
    return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  }

  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(this.getEndpoint('/auth/login'), {
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
          // Ignore storage errors in restricted contexts
        }
      }

      if (credentials.rememberMe) {
        try {
          localStorage.setItem('truson_remembered_email', credentials.email.trim());
        } catch {
          // Ignore storage errors
        }
      } else {
        try {
          localStorage.removeItem('truson_remembered_email');
        } catch {
          // Ignore storage errors
        }
      }

      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Unable to connect to the authentication server. Please check your connection.');
    }
  }

  async register(data: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(this.getEndpoint('/auth/register'), {
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
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Registration failed due to a network issue. Please try again.');
    }
  }

  async forgotPassword(data: ForgotPasswordFormData): Promise<AuthResponse> {
    try {
      const response = await fetch(this.getEndpoint('/auth/forgot-password'), {
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
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to send password reset request. Please check your connection.');
    }
  }

  async initiateGoogleAuth(): Promise<void> {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google OAuth client ID is not configured. Set VITE_GOOGLE_CLIENT_ID in your environment variables.');
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
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
