import React, { useState } from 'react';
import { SearchIcon, SparklesIcon, RefreshIcon } from '../common/Icons';

interface QuestionInputProps {
  currentQuery: string;
  onSubmitQuery: (query: string) => void;
  onSimulateLoading: () => void;
  isLoading: boolean;
  suggestedPrompts: string[];
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  currentQuery,
  onSubmitQuery,
  onSimulateLoading,
  isLoading,
  suggestedPrompts,
}) => {
  const [inputText, setInputText] = useState(currentQuery);
  const [selectedDomain, setSelectedDomain] = useState<'All' | 'Biomedical' | 'Physical Science' | 'Public Policy'>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmitQuery(inputText.trim());
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputText(prompt);
    onSubmitQuery(prompt);
  };

  return (
    <section className="question-input-section" aria-label="Ask a research question">
      <form onSubmit={handleSubmit} className="query-form-card">
        <div className="query-input-header">
          <div className="input-title-row">
            <SparklesIcon size={16} className="sparkle-icon" />
            <label htmlFor="research-question-input" className="input-label">
              Factual Research &amp; Claim Verification
            </label>
          </div>
          <div className="domain-filter-pills" role="radiogroup" aria-label="Knowledge domain">
            {(['All', 'Biomedical', 'Physical Science', 'Public Policy'] as const).map((domain) => (
              <button
                type="button"
                key={domain}
                className={`domain-pill ${selectedDomain === domain ? 'active' : ''}`}
                onClick={() => setSelectedDomain(domain)}
                role="radio"
                aria-checked={selectedDomain === domain}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        <div className="query-textarea-wrapper">
          <textarea
            id="research-question-input"
            rows={3}
            placeholder="Ask a factual question (e.g. 'What is the verified efficacy of the R21 malaria vaccine?')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="query-textarea"
            disabled={isLoading}
          />
        </div>

        <div className="query-actions-bar">
          <div className="prompt-meta-info">
            <span className="char-count">{inputText.length} characters</span>
            <span className="mode-indicator">
              Mode: <strong>Multi-Source Claim Grounding</strong>
            </span>
          </div>

          <div className="action-buttons-group">
            <button
              type="button"
              className="simulate-loading-btn"
              onClick={onSimulateLoading}
              title="Test simulated multi-step verification pipeline"
            >
              <RefreshIcon size={14} className={isLoading ? 'spin-icon' : ''} />
              <span>Simulate Pipeline</span>
            </button>

            <button
              type="submit"
              className="verify-submit-btn"
              disabled={isLoading || !inputText.trim()}
            >
              <SearchIcon size={16} />
              <span>{isLoading ? 'Verifying...' : 'Verify Claims'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Suggested quick prompt pills */}
      <div className="suggested-prompts-row">
        <span className="suggested-label">Try asking:</span>
        <div className="suggested-pills-list">
          {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="suggested-prompt-pill"
              onClick={() => handleSelectPrompt(prompt)}
            >
              &quot;{prompt}&quot;
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

