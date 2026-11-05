import React from 'react';
import type { AppSettings } from '../../types';
import { useAuth } from '../../context/useAuth';
import { XIcon, SlidersIcon, ShieldCheckIcon, UserIcon } from '../common/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenAuth: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenAuth,
}) => {
  const { currentUser, isConfigured, signOut } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <SlidersIcon size={20} className="modal-title-icon" />
            <h3 id="settings-modal-title" className="modal-title">
              Verification &amp; System Settings
            </h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section 1: Verification Threshold */}
          <section className="settings-section">
            <h4 className="section-title">Claim Grounding Rigor</h4>
            <p className="section-desc">
              Determines minimum cosine similarity and corroborating source requirements before a claim is declared &quot;Supported&quot;.
            </p>
            <div className="threshold-options">
              {(
                [
                  {
                    id: 'strict',
                    label: 'Strict / Scientific',
                    desc: 'Requires ≥2 independent primary sources with direct textual overlap.',
                  },
                  {
                    id: 'standard',
                    label: 'Standard Verification',
                    desc: 'Balanced cross-referencing suitable for general factual inquiries.',
                  },
                  {
                    id: 'exploratory',
                    label: 'Exploratory',
                    desc: 'Flags inferences and weak signals without strict rejection.',
                  },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`threshold-card ${
                    settings.verificationThreshold === opt.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="threshold"
                    value={opt.id}
                    checked={settings.verificationThreshold === opt.id}
                    onChange={() =>
                      onUpdateSettings({ ...settings, verificationThreshold: opt.id })
                    }
                  />
                  <div className="threshold-card-content">
                    <span className="threshold-name">{opt.label}</span>
                    <span className="threshold-desc">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Section 2: Visual Highlighting */}
          <section className="settings-section">
            <h4 className="section-title">Evidence Display Preferences</h4>
            <div className="toggle-row">
              <label className="toggle-label" htmlFor="toggle-contradictions">
                <strong>Emphasize Contradicted Claims</strong>
                <span>Visually elevate disputed or refuted statements with prominent warnings.</span>
              </label>
              <input
                id="toggle-contradictions"
                type="checkbox"
                checked={settings.highlightContradictions}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    highlightContradictions: e.target.checked,
                  })
                }
              />
            </div>
            <div className="toggle-row">
              <label className="toggle-label" htmlFor="toggle-footnotes">
                <strong>Numbered Citation Badges</strong>
                <span>Embed interactive source citation chips directly in synthesized answer text.</span>
              </label>
              <input
                id="toggle-footnotes"
                type="checkbox"
                checked={settings.displayFootnotes}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    displayFootnotes: e.target.checked,
                  })
                }
              />
            </div>
          </section>

          {/* Section 3: Profile & Authentication */}
          <section className="settings-section">
            <h4 className="section-title">Researcher Profile &amp; Authentication</h4>
            {currentUser ? (
              <div className="profile-card-inline">
                <div className="profile-avatar-large">
                  <UserIcon size={24} />
                </div>
                <div className="profile-details">
                  <span className="profile-name-text">
                    {currentUser.displayName || 'Authenticated Researcher'}
                  </span>
                  <span className="profile-email">{currentUser.email}</span>
                  <span className="profile-role-pill">
                    UID: {currentUser.uid}
                  </span>
                </div>
                <button
                  type="button"
                  className="auth-action-mini-btn"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="profile-card-inline unauth">
                <div className="profile-avatar-large guest">
                  <UserIcon size={24} />
                </div>
                <div className="profile-details">
                  <span className="profile-name-text">Guest Researcher Mode</span>
                  <span className="profile-email">
                    {isConfigured
                      ? 'Sign in to sync your search sessions to Firestore.'
                      : 'Firebase web credentials pending in .env.'}
                  </span>
                </div>
                <button
                  type="button"
                  className="auth-action-mini-btn primary"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                >
                  Sign In / Register
                </button>
              </div>
            )}
          </section>

          {/* Section 4: System Integration Status */}
          <section className="settings-section integration-status-section">
            <h4 className="section-title">Architecture Pipeline Status</h4>
            <div className="status-grid">
              <div className="status-item">
                <span className="item-label">Local FastAPI Backend:</span>
                <span className="item-status neutral">Scaffolded (Endpoints ready on :8000)</span>
              </div>
              <div className="status-item">
                <span className="item-label">Firebase Auth &amp; Firestore:</span>
                <span className={isConfigured ? 'item-status ready' : 'item-status pending'}>
                  {isConfigured ? 'Active (Phase 2 Integrated)' : 'Config Pending (Add keys to .env)'}
                </span>
              </div>
              <div className="status-item">
                <span className="item-label">Google Gemini API:</span>
                <span className="item-status pending">Scheduled for Phase 3</span>
              </div>
              <div className="status-item">
                <span className="item-label">ChromaDB Vector Store:</span>
                <span className="item-status pending">Scheduled for Phase 4</span>
              </div>
            </div>
          </section>
        </div>

        <div className="modal-footer">
          <div className="footer-note">
            <ShieldCheckIcon size={14} />
            <span>Preferences are stored in local application state.</span>
          </div>
          <button className="modal-confirm-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
