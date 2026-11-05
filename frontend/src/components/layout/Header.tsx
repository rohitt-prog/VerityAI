import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { ShieldCheckIcon, SlidersIcon, UserIcon, MenuIcon } from '../common/Icons';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  sidebarToggleRef?: React.RefObject<HTMLButtonElement | null>;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenAuth,
  onToggleSidebar,
  isSidebarOpen,
  sidebarToggleRef,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { currentUser, signOut, isConfigured } = useAuth();

  const displayName = currentUser
    ? currentUser.displayName || currentUser.email?.split('@')[0] || 'Researcher'
    : 'Guest Analyst';

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

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
              <span className="phase-pill">Phase 2 Firebase</span>
            </div>
            <span className="brand-subtext">Hallucination-Aware Information Assistant</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Backend status pill */}
        <div
          className="status-pill-neutral"
          title="Backend health check deferred to Phase 2 (UI mock mode)"
        >
          <span className="status-dot-neutral" aria-hidden="true"></span>
          <span className="status-text">Backend status not checked</span>
        </div>

        {/* Firebase Config / Auth status indicator */}
        <div
          className={currentUser ? 'firebase-auth-pill signed-in' : 'firebase-auth-pill'}
          title={
            currentUser
              ? `Authenticated as ${currentUser.email}`
              : isConfigured
              ? 'Firebase Web SDK configured (Unauthenticated)'
              : 'Firebase unconfigured (Add keys to .env)'
          }
        >
          <span className={currentUser ? 'auth-dot active' : 'auth-dot'} aria-hidden="true"></span>
          <span className="auth-pill-text">
            {currentUser ? 'Firebase Auth: Active' : isConfigured ? 'Firebase Ready' : 'Firebase Offline'}
          </span>
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
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                setShowProfileMenu((prev) => !prev);
              }
            }}
            aria-label="User Profile"
            aria-expanded={showProfileMenu}
          >
            <div className={`avatar-placeholder ${currentUser ? 'avatar-authenticated' : ''}`}>
              <UserIcon size={16} />
            </div>
            <span className="user-name">{displayName}</span>
          </button>

          {showProfileMenu && currentUser && (
            <div className="profile-dropdown-menu" role="menu">
              <div className="profile-info-header">
                <strong>{currentUser.displayName || 'Authenticated Researcher'}</strong>
                <span className="profile-email-line">{currentUser.email}</span>
                <span className="profile-uid-line" title={currentUser.uid}>
                  UID: {currentUser.uid.slice(0, 10)}...
                </span>
              </div>
              <div className="dropdown-divider" />
              <div className="profile-stat-row">
                <span>Auth Provider:</span>
                <span className="stat-badge">Firebase Auth</span>
              </div>
              <div className="profile-stat-row">
                <span>Access Level:</span>
                <strong>UID Scoped</strong>
              </div>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item-btn"
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenSettings();
                }}
              >
                System &amp; Data Settings
              </button>
              <button
                className="dropdown-item-btn signout-btn"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
