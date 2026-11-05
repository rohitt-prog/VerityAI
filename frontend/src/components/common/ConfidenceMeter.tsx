import React from 'react';
import { InfoIcon } from './Icons';

interface ConfidenceMeterProps {
  score: number; // 0 - 100
  label?: string;
  size?: 'compact' | 'full';
  showDisclaimer?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  label = 'Grounding Confidence',
  size = 'full',
  showDisclaimer = true,
}) => {
  // Determine color band based on score
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'var(--color-supported)';
    if (val >= 70) return 'var(--color-inferred)';
    if (val >= 50) return 'var(--color-insufficient)';
    return 'var(--color-contradicted)';
  };

  const scoreColor = getScoreColor(score);

  if (size === 'compact') {
    return (
      <div className="confidence-meter-compact" title="Illustrative mock confidence score">
        <div className="meter-label-row">
          <span className="meter-title">{label} (mock)</span>
          <span className="meter-score" style={{ color: scoreColor }}>
            {score}%
          </span>
        </div>
        <div className="meter-bar-track">
          <div
            className="meter-bar-fill"
            style={{ width: `${score}%`, backgroundColor: scoreColor }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="confidence-card">
      <div className="confidence-header">
        <div className="confidence-title-group">
          <span className="confidence-eyebrow">Attribution Confidence (Simulated)</span>
          <h4 className="confidence-title">{label}</h4>
        </div>
        <div className="confidence-value-pill" style={{ borderColor: scoreColor }}>
          <span className="confidence-number" style={{ color: scoreColor }}>
            {score}%
          </span>
          <span className="confidence-unit">mock score</span>
        </div>
      </div>

      <div className="confidence-bar-container">
        <div className="confidence-track">
          <div
            className="confidence-fill"
            style={{ width: `${score}%`, backgroundColor: scoreColor }}
          />
        </div>
        <div className="confidence-markers">
          <span>0% Low</span>
          <span>50% Moderate</span>
          <span>80%+ High Grounding</span>
        </div>
      </div>

      {showDisclaimer && (
        <div className="mock-disclaimer-banner">
          <InfoIcon size={14} className="disclaimer-icon" />
          <span className="disclaimer-text">
            <strong>Illustrative Mock Indicator:</strong> Confidence metrics shown in Phase 1
            are UI representations and do not reflect active model inferences.
          </span>
        </div>
      )}
    </div>
  );
};

