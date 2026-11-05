import React, { useState, useRef, useEffect } from 'react';
import { sampleQueries, mockHistorySessions, initialSettings, suggestedPrompts } from './data/mockData';
import type { ResearchQueryItem, AppSettings } from './types';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SettingsModal } from './components/layout/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { QuestionInput } from './components/research/QuestionInput';
import { AnswerView } from './components/research/AnswerView';
import { EmptyState } from './components/research/EmptyState';
import { LoadingState } from './components/research/LoadingState';
import { saveUserSession } from './services/firestore';
import './App.css';

const AppContent: React.FC = () => {
  const [activeQuery, setActiveQuery] = useState<ResearchQueryItem>(sampleQueries[0]);
  const [viewState, setViewState] = useState<'answered' | 'empty' | 'loading'>('answered');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [pendingQueryText, setPendingQueryText] = useState(sampleQueries[0].query);

  const { currentUser } = useAuth();

  // Focus management ref for menu trigger
  const sidebarToggleRef = useRef<HTMLButtonElement | null>(null);
  const prevSidebarOpenRef = useRef(isSidebarOpen);

  useEffect(() => {
    if (prevSidebarOpenRef.current && !isSidebarOpen) {
      sidebarToggleRef.current?.focus();
    }
    prevSidebarOpenRef.current = isSidebarOpen;
  }, [isSidebarOpen]);

  const handleSelectSession = (queryId: string) => {
    const found = sampleQueries.find((q) => q.id === queryId) || sampleQueries[0];
    setActiveQuery(found);
    setPendingQueryText(found.query);
    setViewState('answered');
  };

  const handleNewQuery = () => {
    setViewState('empty');
    setPendingQueryText('');
  };

  const handleSubmitQuery = (queryText: string) => {
    setPendingQueryText(queryText);
    setViewState('loading');

    // Simulate 2.4-second verification turnaround
    setTimeout(() => {
      const nextQuery =
        sampleQueries.find((q) =>
          q.query.toLowerCase().includes(queryText.toLowerCase().slice(0, 15))
        ) || {
          ...sampleQueries[0],
          id: `query-dynamic-${Date.now()}`,
          query: queryText,
        };

      setActiveQuery(nextQuery);
      setViewState('answered');

      // If user is authenticated, asynchronously sync session to Firestore (marked as prototype simulation)
      if (currentUser) {
        saveUserSession(currentUser.uid, {
          title: queryText.slice(0, 48),
          query: queryText,
          claims_count: nextQuery.claims.length,
          is_mock: true,
        }).catch((err) => {
          console.warn('Firestore background session save skipped:', err);
        });
      }
    }, 2400);
  };

  const handleSimulateLoading = () => {
    setViewState('loading');
    setTimeout(() => {
      setViewState('answered');
    }, 3200);
  };

  return (
    <div className={`verity-app-shell theme-${settings.uiTheme}`}>
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        sidebarToggleRef={sidebarToggleRef}
      />

      <div className="verity-main-layout">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sessions={mockHistorySessions}
          activeQueryId={activeQuery.id}
          onSelectSession={handleSelectSession}
          onNewQuery={handleNewQuery}
        />

        <main className="verity-content-area" id="main-content">
          <div className="content-max-width">
            {/* Always accessible input section */}
            <QuestionInput
              currentQuery={pendingQueryText}
              onSubmitQuery={handleSubmitQuery}
              onSimulateLoading={handleSimulateLoading}
              isLoading={viewState === 'loading'}
              suggestedPrompts={suggestedPrompts}
            />

            {/* Dynamic View Area: Loading, Empty, or Answered */}
            <div className="view-transition-wrapper">
              {viewState === 'loading' && (
                <LoadingState queryText={pendingQueryText || activeQuery.query} />
              )}

              {viewState === 'empty' && (
                <EmptyState
                  onSelectPrompt={(prompt) => {
                    handleSubmitQuery(prompt);
                  }}
                  prompts={suggestedPrompts}
                />
              )}

              {viewState === 'answered' && <AnswerView data={activeQuery} />}
            </div>
          </div>
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
