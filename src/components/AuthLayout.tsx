import React from 'react';
import { ShieldCheck, Lock, Sparkles, KeyRound, Cpu, FileCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-page-root">
      {/* Left Panel - Ultra-Premium Hero (Hidden on Mobile) */}
      <aside className="auth-left-hero">
        <div className="hero-orbs" aria-hidden="true">
          <div className="orb orb-primary" />
          <div className="orb orb-secondary" />
          <div className="orb orb-accent" />
        </div>

        <div className="hero-content">
          <div className="brand-logo-container">
            <div className="logo-icon-badge">
              <img src="/truson-logo.jpg" alt="TRUSON Logo" className="brand-logo-img" />
            </div>
            <span className="brand-name">TRUSON</span>
            <span className="brand-badge-pill">ENTERPRISE</span>
          </div>

          <div className="hero-copy-group">
            <div className="hero-eyebrow-badge">
              <Sparkles size={14} aria-hidden="true" />
              <span>ZERO-TRUST IDENTITY PLATFORM</span>
            </div>
            <h2 className="hero-title">
              Securing the next era <br />
              <span className="text-gradient">of digital trust.</span>
            </h2>
            <p className="hero-description">
              Unified authentication, granular access controls, and automated compliance built for high-growth engineering teams and global enterprises.
            </p>
          </div>

          <div className="hero-features-list">
            <div className="feature-item">
              <div className="feature-icon-badge">
                <KeyRound size={16} aria-hidden="true" />
              </div>
              <span>Instant OAuth 2.0 & Passkey Authentication</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-badge">
                <Cpu size={16} aria-hidden="true" />
              </div>
              <span>Real-Time Anomaly & Threat Detection</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-badge">
                <FileCheck size={16} aria-hidden="true" />
              </div>
              <span>Automated SOC 2, HIPAA & ISO 27001 Auditing</span>
            </div>
          </div>

          <div className="hero-security-card">
            <div className="security-card-top">
              <div className="security-pulse-indicator">
                <div className="pulse-dot" aria-hidden="true" />
                <span className="security-card-title">SYSTEMS OPERATIONAL &bull; 99.999% SLA</span>
              </div>
              <Lock size={16} style={{ color: '#94a3b8' }} aria-hidden="true" />
            </div>
            <div className="compliance-tags">
              <span className="tag-pill">SOC 2 TYPE II</span>
              <span className="tag-pill">ISO 27001</span>
              <span className="tag-pill">GDPR READY</span>
              <span className="tag-pill">AES-256 ENCRYPTED</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Panel - Auth Form Area */}
      <main className="auth-right-panel">
        <div className="mobile-brand-header">
          <div className="brand-logo-container">
            <div className="logo-icon-badge">
              <img src="/truson-logo.jpg" alt="TRUSON Logo" className="brand-logo-img" />
            </div>
            <span className="brand-name">TRUSON</span>
            <span className="brand-badge-pill">ENTERPRISE</span>
          </div>
        </div>

        <div className="form-viewport">
          {children}
        </div>

        <footer className="auth-page-footer">
          <p>&copy; {new Date().getFullYear()} TRUSON Identity Inc. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};
