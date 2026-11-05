import React from 'react';
import { ShieldCheckIcon, SlidersIcon, UserIcon, MenuIcon } from '../common/Icons';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  sidebarToggleRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onToggleSidebar,
  isSidebarOpen,
  sidebarToggleRef,
}) => {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          ref={sidebarToggleRef}
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <MenuIcon size={20} />
        </button>

        <div className="brand-group">
          <div className="brand-logo-mark">
            <ShieldCheckIcon size={22} className="logo-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <span className="brand-title">VerityAI</span>
              <span className="phase-pill">Phase 1 UI</span>
            </div>
            <span className="brand-subtext">Hallucination-Aware Information Assistant</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Fix 1: Neutral unverified status indicator (no live polling in Phase 1) */}
        <div
          className="status-pill-neutral"
          title="Backend health check deferred to Phase 2 (UI mock mode)"
        >
          <span className="status-dot-neutral" aria-hidden="true"></span>
          <span className="status-text">Backend status not checked</span>
        </div>

        <button
          className="header-action-btn"
          onClick={onOpenSettings}
          aria-label="Verification & System Settings"
          title="Verification Settings"
        >
          <SlidersIcon size={18} />
          <span className="btn-label">Settings</span>
        </button>

        <div className="profile-container">
          <button
            className="user-avatar-btn"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-label="User Profile"
            aria-expanded={showProfileMenu}
          >
            <div className="avatar-placeholder">
              <UserIcon size={16} />
            </div>
            <span className="user-name">Dr. Vance</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown-menu" role="menu">
              <div className="profile-info-header">
                <strong>Dr. Elena Vance</strong>
                <span className="profile-role">Lead Research Analyst</span>
                <span className="profile-org">Evidence Evaluation Lab</span>
              </div>
              <div className="dropdown-divider" />
              <div className="profile-stat-row">
                <span>Verification Tier:</span>
                <span className="stat-badge">Pro Verified</span>
              </div>
              <div className="profile-stat-row">
                <span>Claims Analyzed:</span>
                <strong>1,420</strong>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item-btn"
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenSettings();
                }}
              >
                Verification Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
