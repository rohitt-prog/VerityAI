import React, { useState, useRef } from 'react';
import type { ResearchQueryItem, VerificationStatus } from '../../types';
import { statusConfig } from '../common/statusConfig';
import { ConfidenceMeter } from '../common/ConfidenceMeter';
import { ClaimCard } from './ClaimCard';
import { EvidenceCard } from './EvidenceCard';
import { BookOpenIcon, ShieldCheckIcon, InfoIcon, AlertTriangleIcon } from '../common/Icons';

interface AnswerViewProps {
  data: ResearchQueryItem;
}

export const AnswerView: React.FC<AnswerViewProps> = ({ data }) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | VerificationStatus>('all');
  const [activeTab, setActiveTab] = useState<'claims' | 'evidence'>('claims');

  // Fix 6: Tab refs for accessible keyboard navigation
  const claimsTabRef = useRef<HTMLButtonElement>(null);
  const evidenceTabRef = useRef<HTMLButtonElement>(null);

  const filteredClaims =
    statusFilter === 'all'
      ? data.claims
      : data.claims.filter((c) => c.status === statusFilter);

  // Fix 3: Claim navigation with filter safety and auto-tab switching
  const handleSelectClaim = (claimId: string) => {
    const isDeselecting = claimId === selectedClaimId;
    const newSelectedId = isDeselecting ? null : claimId;
    setSelectedClaimId(newSelectedId);

    const targetClaim = data.claims.find((c) => c.id === claimId);
    if (!isDeselecting && targetClaim) {
      // Ensure target claim is rendered in the list even if a filter hides it
      if (statusFilter !== 'all' && targetClaim.status !== statusFilter) {
        setStatusFilter('all');
      }

      // On mobile/tablet, switch to claims tab
      setActiveTab('claims');

      // Highlight target claim's primary evidence
      if (targetClaim.evidenceIds.length > 0) {
        setHighlightedEvidenceId(targetClaim.evidenceIds[0]);
      } else {
        setHighlightedEvidenceId(null);
      }

      // Smoothly scroll to the target claim card
      setTimeout(() => {
        const el = document.getElementById(`claim-${claimId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 60);
    } else {
      setHighlightedEvidenceId(null);
    }
  };

  const handleSelectEvidence = (evidenceId: string) => {
    setHighlightedEvidenceId(evidenceId === highlightedEvidenceId ? null : evidenceId);
    setActiveTab('evidence');
    // Scroll smoothly to target evidence card
    setTimeout(() => {
      const el = document.getElementById(`evidence-${evidenceId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  // Fix 6: Keyboard navigation for mobile tabs (Arrow keys, Home, End)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeTab === 'claims') {
        setActiveTab('evidence');
        evidenceTabRef.current?.focus();
      } else {
        setActiveTab('claims');
        claimsTabRef.current?.focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeTab === 'evidence') {
        setActiveTab('claims');
        claimsTabRef.current?.focus();
      } else {
        setActiveTab('evidence');
        evidenceTabRef.current?.focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab('claims');
      claimsTabRef.current?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab('evidence');
      evidenceTabRef.current?.focus();
    }
  };

  return (
    <div className="answer-view-container">
      {/* Overview Grounding Header */}
      <section className="answer-header-card" aria-label="Verification Summary">
        <div className="answer-header-top">
          <div className="query-meta-badge-group">
            <span className="category-pill">{data.domainCategory}</span>
            <span className="verification-timestamp">Verified Mock Run</span>
          </div>

          <div className="grounding-status-tally">
            <span className="tally-item supported" title="Directly backed claims (mock)">
              <span className="tally-dot"></span>
              <strong>{data.groundingMetrics.supported}</strong> Supported
            </span>
            <span className="tally-item inferred" title="Logically deduced claims (mock)">
              <span className="tally-dot"></span>
              <strong>{data.groundingMetrics.inferred}</strong> Inferred
            </span>
            <span className="tally-item contradicted" title="Disputed or refuted claims (mock)">
              <span className="tally-dot"></span>
              <strong>{data.groundingMetrics.contradicted}</strong> Contradicted
            </span>
            <span className="tally-item insufficient" title="Lacking sufficient evidence (mock)">
              <span className="tally-dot"></span>
              <strong>{data.groundingMetrics.insufficient}</strong> Insufficient
            </span>
          </div>
        </div>

        <h2 className="current-query-heading">{data.query}</h2>

        {/* Confidence Meter */}
        <div className="confidence-meter-row">
          <ConfidenceMeter score={data.mockConfidenceScore} />
        </div>
      </section>

      {/* Fix 4: Persistent Clinical Mock-Data Disclaimer Banner */}
      <aside
        className="clinical-mock-disclaimer-banner"
        role="note"
        aria-label="Clinical Prototype Notice"
      >
        <AlertTriangleIcon size={18} className="clinical-disclaimer-icon" />
        <div className="clinical-disclaimer-body">
          <strong className="disclaimer-bold">Simulated Evaluation Prototype.</strong> Medical claims,
          attribution verdicts, and citations are mock demonstrations for interface evaluation and do
          not constitute clinical guidance.
        </div>
      </aside>

      {/* Synthesized Grounded Response with sentence citations */}
      <section className="synthesized-answer-card" aria-label="Synthesized Grounded Answer">
        <div className="synthesized-header">
          <div className="synthesized-title-wrap">
            <ShieldCheckIcon size={18} className="shield-icon" />
            <h3 className="synthesized-title">Synthesized Evidence-Grounded Response</h3>
          </div>
          <span className="citation-hint">
            <InfoIcon size={14} /> Click any claim pill to inspect corroborating citations
          </span>
        </div>

        <div className="answer-body-content">
          <p className="summary-lead">{data.summary}</p>

          <div className="paragraphs-list">
            {data.paragraphs.map((p) => {
              const paragraphClaims = data.claims.filter((c) => p.claimIds.includes(c.id));
              return (
                <div key={p.id} className="answer-paragraph-block">
                  <span className="paragraph-text">{p.text}</span>
                  <span className="inline-claim-badges">
                    {paragraphClaims.map((claim) => {
                      const isSelected = selectedClaimId === claim.id;
                      return (
                        <button
                          key={claim.id}
                          type="button"
                          className={`inline-claim-chip status-${claim.status} ${
                            isSelected ? 'chip-active' : ''
                          }`}
                          onClick={() => handleSelectClaim(claim.id)}
                          title={`Claim ${claim.claimNumber}: ${statusConfig[claim.status].label} (${claim.mockConfidence}% mock confidence)`}
                          aria-label={`Claim ${claim.claimNumber} status: ${claim.status}`}
                        >
                          <span className="chip-c-tag">C{claim.claimNumber}</span>
                          <span className="chip-status-text">{statusConfig[claim.status].label}</span>
                        </button>
                      );
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fix 6: Accessible Tab Switcher for Tablet/Mobile */}
      <div
        className="mobile-tab-switcher"
        role="tablist"
        aria-label="Research content views"
        onKeyDown={handleTabKeyDown}
      >
        <button
          ref={claimsTabRef}
          id="tab-claims"
          className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
          role="tab"
          aria-selected={activeTab === 'claims'}
          aria-controls="panel-claims"
          tabIndex={activeTab === 'claims' ? 0 : -1}
        >
          Claims Analysis ({data.claims.length})
        </button>
        <button
          ref={evidenceTabRef}
          id="tab-evidence"
          className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
          role="tab"
          aria-selected={activeTab === 'evidence'}
          aria-controls="panel-evidence"
          tabIndex={activeTab === 'evidence' ? 0 : -1}
        >
          Retrieved Evidence ({data.evidence.length})
        </button>
      </div>

      {/* Dual Column Layout: Claims Breakdown & Evidence Cards */}
      <div className="claims-evidence-grid">
        {/* Left Column: Claims Filter & Cards */}
        <section
          id="panel-claims"
          role="tabpanel"
          aria-labelledby="tab-claims"
          className={`claims-column ${activeTab === 'claims' ? 'visible-mobile' : 'hidden-mobile'}`}
          tabIndex={0}
        >
          <div className="column-header">
            <div className="column-title-group">
              <h4 className="column-title">Extracted Claims &amp; Proof Verdicts</h4>
              <span className="column-subtitle">
                Decomposed atomic statements evaluated against indexed documents
              </span>
            </div>

            {/* Status Filter Bar */}
            <div className="status-filter-pills" role="radiogroup" aria-label="Filter claims by verdict">
              {(
                [
                  { id: 'all', label: `All (${data.claims.length})` },
                  { id: 'supported', label: `Supported (${data.groundingMetrics.supported})` },
                  { id: 'inferred', label: `Inferred (${data.groundingMetrics.inferred})` },
                  { id: 'contradicted', label: `Contradicted (${data.groundingMetrics.contradicted})` },
                  { id: 'insufficient', label: `Insufficient (${data.groundingMetrics.insufficient})` },
                ] as const
              ).map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`filter-pill ${statusFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setStatusFilter(filter.id)}
                  role="radio"
                  aria-checked={statusFilter === filter.id}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="claims-cards-list">
            {filteredClaims.length === 0 ? (
              <div className="empty-filter-state">
                No claims match the &quot;{statusFilter}&quot; status filter.
              </div>
            ) : (
              filteredClaims.map((claim) => (
                <ClaimCard
                  key={claim.id}
                  claim={claim}
                  allEvidence={data.evidence}
                  isSelected={selectedClaimId === claim.id}
                  onSelectClaim={handleSelectClaim}
                  onSelectEvidence={handleSelectEvidence}
                />
              ))
            )}
          </div>
        </section>

        {/* Right Column: Evidence / Provenance Cards */}
        <section
          id="panel-evidence"
          role="tabpanel"
          aria-labelledby="tab-evidence"
          className={`evidence-column ${activeTab === 'evidence' ? 'visible-mobile' : 'hidden-mobile'}`}
          tabIndex={0}
        >
          <div className="column-header">
            <div className="column-title-group">
              <div className="evidence-title-with-icon">
                <BookOpenIcon size={18} />
                <h4 className="column-title">Evidence &amp; Provenance Corpus</h4>
              </div>
              <span className="column-subtitle">
                Authoritative passages retrieved via vector similarity search
              </span>
            </div>
            <span className="source-count-badge">{data.evidence.length} Sources</span>
          </div>

          <div className="evidence-cards-list">
            {data.evidence.map((source) => (
              <EvidenceCard
                key={source.id}
                evidence={source}
                isHighlighted={highlightedEvidenceId === source.id}
                onSelectEvidence={handleSelectEvidence}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
