import React from 'react';
import type { GroundedClaim, EvidenceSource } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { BookOpenIcon } from '../common/Icons';

interface ClaimCardProps {
  claim: GroundedClaim;
  allEvidence: EvidenceSource[];
  isSelected: boolean;
  onSelectClaim: (claimId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  allEvidence,
  isSelected,
  onSelectClaim,
  onSelectEvidence,
}) => {
  const linkedSources = allEvidence.filter((ev) => claim.evidenceIds.includes(ev.id));

  return (
    <article
      id={`claim-${claim.id}`}
      className={`claim-card status-border-${claim.status} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectClaim(claim.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectClaim(claim.id);
        }
      }}
      aria-label={`Claim ${claim.claimNumber}: ${claim.text}`}
    >
      <div className="claim-card-header">
        <div className="claim-id-wrap">
          <span className="claim-number-tag">Claim {claim.claimNumber}</span>
          <VerificationBadge status={claim.status} size="sm" />
        </div>
        <div className="claim-confidence-pill" title="Illustrative mock claim confidence">
          <span className="confidence-label">Conf (mock):</span>
          <span className="confidence-val">{claim.mockConfidence}%</span>
        </div>
      </div>

      <p className="claim-text">&ldquo;{claim.text}&rdquo;</p>

      {claim.excerptHighlight && (
        <div className="matched-excerpt-box">
          <span className="excerpt-label">Source Key Finding:</span>
          <blockquote className="excerpt-quote">&ldquo;{claim.excerptHighlight}&rdquo;</blockquote>
        </div>
      )}

      <div className="verdict-rationale-box">
        <span className="rationale-label">Evaluation Verdict:</span>
        <p className="rationale-text">{claim.verdictExplanation}</p>
      </div>

      <div className="linked-evidence-row">
        <span className="evidence-link-title">
          <BookOpenIcon size={14} />
          <span>Cited Sources ({linkedSources.length}):</span>
        </span>
        <div className="evidence-chips-list">
          {linkedSources.map((source) => (
            <button
              key={source.id}
              type="button"
              className="evidence-chip-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectEvidence(source.id);
              }}
              title={`View citation details from ${source.domain} (mock match score)`}
            >
              <span className="chip-domain">{source.domain}</span>
              <span className="chip-score">{(source.relevanceScore * 100).toFixed(0)}% match (mock)</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
};
