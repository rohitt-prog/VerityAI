import React, { useState, useEffect, useRef } from 'react';
import type { HistorySession } from '../../types';
import { PlusIcon, SearchIcon, ClockIcon, XIcon, ShieldCheckIcon } from '../common/Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: HistorySession[];
  activeQueryId: string;
  onSelectSession: (queryId: string) => void;
  onNewQuery: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeQueryId,
  onSelectSession,
  onNewQuery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fix 5: Escape-key dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fix 5: Focus management - focus the close button when drawer opens on mobile
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groups: Array<'Today' | 'Yesterday' | 'Previous 7 Days'> = [
    'Today',
    'Yesterday',
    'Previous 7 Days',
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`app-sidebar ${isOpen ? 'open' : 'collapsed'}`}
        aria-hidden={!isOpen}
        aria-label="Research Sessions Sidebar"
      >
        <div className="sidebar-header">
          <div className="sidebar-title-row">
            <div className="sidebar-brand-mini">
              <ShieldCheckIcon size={18} className="sidebar-logo-icon" />
              <span className="sidebar-brand-name">Research Sessions</span>
            </div>
            <button
              ref={closeButtonRef}
              className="sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <XIcon size={18} />
            </button>
          </div>

          <button className="new-query-btn" onClick={onNewQuery}>
            <PlusIcon size={16} />
            <span>New Research Query</span>
          </button>

          <div className="sidebar-search-box">
            <SearchIcon size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Filter session history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sidebar-search-input"
              aria-label="Search past queries"
              tabIndex={!isOpen ? -1 : 0}
            />
          </div>
        </div>

        <nav className="sidebar-scroll-area" aria-label="Query History">
          {filteredSessions.length === 0 ? (
            <div className="sidebar-empty">No sessions match &quot;{searchTerm}&quot;</div>
          ) : (
            groups.map((group) => {
              const groupSessions = filteredSessions.filter((s) => s.group === group);
              if (groupSessions.length === 0) return null;

              return (
                <div key={group} className="history-group">
                  <div className="history-group-title">{group}</div>
                  <ul className="history-list">
                    {groupSessions.map((session) => {
                      const isActive = session.queryId === activeQueryId;
                      return (
                        <li key={session.id}>
                          <button
                            className={`history-item-btn ${isActive ? 'active' : ''}`}
                            onClick={() => {
                              onSelectSession(session.queryId);
                              // On mobile, automatically close drawer on selection
                              if (window.innerWidth < 1024) onClose();
                            }}
                            aria-current={isActive ? 'true' : undefined}
                            tabIndex={!isOpen ? -1 : 0}
                          >
                            <div className="history-item-header">
                              <span className="history-item-title">{session.title}</span>
                            </div>
                            <p className="history-item-preview">{session.preview}</p>
                            <div className="history-item-meta">
                              <span className="history-time">
                                <ClockIcon size={12} />
                                {session.timeAgo}
                              </span>
                              <span className="history-pill">
                                {session.claimsCount} claims
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-stat">
            <span className="stat-label">Model Verification Mode</span>
            <span className="stat-value">High Rigor (Mock)</span>
          </div>
        </div>
      </aside>
    </>
  );
};
