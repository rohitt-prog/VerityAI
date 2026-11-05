import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { XIcon, ShieldCheckIcon, UserIcon, AlertTriangleIcon } from '../common/Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { signIn, signUp, error, clearError, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Please provide both an email address and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setLocalError(null);
    clearError();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="auth-modal-icon-badge">
              <UserIcon size={18} />
            </div>
            <h3 id="auth-modal-title" className="modal-title">
              {mode === 'signin' ? 'Researcher Sign In' : 'Create Researcher Account'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <XIcon size={20} />
          </button>
        </div>

        <div className="modal-body auth-modal-body">
          {!isConfigured ? (
            <div className="firebase-unconfigured-notice">
              <AlertTriangleIcon size={20} className="notice-icon" />
              <div className="notice-content">
                <strong>Firebase Web Keys Pending</strong>
                <p>
                  Firebase Authentication is enabled in the code, but local environment variables
                  have not yet been configured in your <code>.env</code> file.
                </p>
                <div className="notice-code-box">
                  <code>
                    VITE_FIREBASE_API_KEY=...<br />
                    VITE_FIREBASE_AUTH_DOMAIN=...<br />
                    VITE_FIREBASE_PROJECT_ID=...
                  </code>
                </div>
                <p className="notice-subtext">
                  Copy <code>.env.example</code> to <code>.env</code> and populate your Firebase project credentials.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {(localError || error) && (
                <div className="auth-error-banner" role="alert">
                  <AlertTriangleIcon size={16} />
                  <span>{localError || error}</span>
                </div>
              )}

              <div className="auth-field-group">
                <label htmlFor="auth-email-input" className="auth-field-label">
                  Institutional / Research Email
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  placeholder="analyst@verity-health.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-text-input"
                  required
                  autoComplete="email"
                  disabled={submitting}
                />
              </div>

              <div className="auth-field-group">
                <label htmlFor="auth-password-input" className="auth-field-label">
                  Password
                </label>
                <input
                  id="auth-password-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-text-input"
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={submitting}
              >
                {submitting
                  ? 'Verifying Credentials...'
                  : mode === 'signin'
                  ? 'Sign In to Workspace'
                  : 'Register Account'}
              </button>

              <div className="auth-mode-switch">
                <span>
                  {mode === 'signin'
                    ? "Don't have an account?"
                    : 'Already registered?'}
                </span>
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={toggleMode}
                  disabled={submitting}
                >
                  {mode === 'signin' ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer auth-modal-footer">
          <div className="footer-note">
            <ShieldCheckIcon size={14} />
            <span>Protected by Firebase Authentication &amp; Firestore UID isolation.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
