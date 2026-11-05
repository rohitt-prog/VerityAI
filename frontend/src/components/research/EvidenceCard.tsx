import React from 'react';
import type { EvidenceSource } from '../../types';
import { ExternalLinkIcon, BookOpenIcon } from '../common/Icons';

interface EvidenceCardProps {
  evidence: EvidenceSource;
  isHighlighted: boolean;
  onSelectEvidence: (id: string) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  isHighlighted,
  onSelectEvidence,
}) => {
  const getBadgeClass = (badge: EvidenceSource['badgeType']) => {
    switch (badge) {
      case 'Primary Source':
        return 'evidence-badge-primary';
      case 'Refuting Source':
        return 'evidence-badge-refuting';
      case 'Corroborating Source':
        return 'evidence-badge-corroborating';
      default:
        return 'evidence-badge-contextual';
    }
  };

  return (
    <article
      id={`evidence-${evidence.id}`}
      className={`evidence-card ${isHighlighted ? 'highlighted-evidence' : ''}`}
      onClick={() => onSelectEvidence(evidence.id)}
      role="region"
      aria-label={`Source: ${evidence.title}`}
    >
      <div className="evidence-header">
        <div className="source-domain-tag">
          <BookOpenIcon size={14} className="source-icon" />
          <span className="domain-name">{evidence.domain}</span>
        </div>
        <div className="evidence-score-pill" title="Vector similarity score (illustrative mock)">
          <span className="score-val">{(evidence.relevanceScore * 100).toFixed(0)}%</span>
          <span className="score-unit">relevance (mock)</span>
        </div>
      </div>

      <h5 className="evidence-title">
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="evidence-external-link"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{evidence.title}</span>
          <ExternalLinkIcon size={13} className="ext-icon" />
        </a>
      </h5>

      <div className="evidence-meta-row">
        {evidence.authors && (
          <span className="evidence-authors" title={evidence.authors}>
            {evidence.authors}
          </span>
        )}
        {evidence.publicationDate && (
          <span className="evidence-date">• {evidence.publicationDate}</span>
        )}
      </div>

      <div className="evidence-quote-box">
        <span className="quote-eyebrow">Retrieved Passage:</span>
        <blockquote className="evidence-excerpt">&ldquo;{evidence.excerpt}&rdquo;</blockquote>
      </div>

      <div className="evidence-card-footer">
        <span className={`evidence-category-badge ${getBadgeClass(evidence.badgeType)}`}>
          {evidence.badgeType}
        </span>
        <span className="evidence-id-tag">ID: {evidence.id}</span>
      </div>
    </article>
  );
};
