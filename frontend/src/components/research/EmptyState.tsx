import React from 'react';
import { ShieldCheckIcon, CheckCircleIcon, AlertTriangleIcon, BookOpenIcon, ArrowRightIcon } from '../common/Icons';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
  prompts: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, prompts }) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-hero">
        <div className="hero-shield-icon-wrap">
          <ShieldCheckIcon size={44} className="hero-shield-icon" />
        </div>
        <h2 className="empty-hero-title">Hallucination-Aware Information Assistant</h2>
        <p className="empty-hero-desc">
          VerityAI bridges the critical trust gap in generative AI. Rather than generating
          unverified text, VerityAI extracts atomic claims, searches authoritative evidence sources,
          and transparently flags <strong>Supported</strong>, <strong>Inferred</strong>,{' '}
          <strong>Contradicted</strong>, and <strong>Insufficient Evidence</strong> assertions.
        </p>
      </div>

      {/* Trust Pillars */}
      <div className="trust-pillars-grid">
        <div className="trust-pillar-card">
          <div className="pillar-icon-box">
            <CheckCircleIcon size={20} className="icon-supported" />
          </div>
          <h4 className="pillar-title">Atomic Claim Extraction</h4>
          <p className="pillar-desc">
            Answers are decomposed into discrete, verifiable propositions before attribution scoring.
          </p>
        </div>

        <div className="trust-pillar-card">
          <div className="pillar-icon-box">
            <BookOpenIcon size={20} className="icon-sources" />
          </div>
          <h4 className="pillar-title">Grounded Evidence Corpus</h4>
          <p className="pillar-desc">
            Passages are pulled directly from peer-reviewed literature, official agencies, and indexed knowledge.
          </p>
        </div>

        <div className="trust-pillar-card">
          <div className="pillar-icon-box">
            <AlertTriangleIcon size={20} className="icon-contradiction" />
          </div>
          <h4 className="pillar-title">Contradiction Detection</h4>
          <p className="pillar-desc">
            Discrepancies and misinformation are proactively surfaced rather than hallucinated as truth.
          </p>
        </div>
      </div>

      {/* Suggested Starters */}
      <div className="starter-questions-section">
        <h4 className="starters-heading">Explore Sample Verification Queries</h4>
        <div className="starters-list">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="starter-prompt-card"
              onClick={() => onSelectPrompt(prompt)}
            >
              <div className="starter-text-wrap">
                <span className="starter-query-text">&ldquo;{prompt}&rdquo;</span>
                <span className="starter-tag">Verified Demo</span>
              </div>
              <ArrowRightIcon size={16} className="arrow-icon" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

