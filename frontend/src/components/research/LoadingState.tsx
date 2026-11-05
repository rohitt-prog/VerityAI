import React, { useEffect, useState } from 'react';
import { ShieldCheckIcon } from '../common/Icons';

interface LoadingStateProps {
  queryText: string;
}

const pipelineStages = [
  { id: 1, title: 'Decomposing Propositions', desc: 'Extracting discrete atomic factual claims...' },
  { id: 2, title: 'Querying Knowledge Corpus', desc: 'Retrieving high-relevance vector passages from indexed sources...' },
  { id: 3, title: 'Cross-Verifying Claims', desc: 'Evaluating semantic entailment, inferences, and contradictions...' },
  { id: 4, title: 'Synthesizing Provenance Report', desc: 'Calculating grounding confidence metrics and mapping citations...' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({ queryText }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-state-card" role="status" aria-live="polite">
      <div className="loading-header">
        <div className="loading-pulse-ring">
          <ShieldCheckIcon size={24} className="pulse-icon" />
        </div>
        <div className="loading-title-group">
          <h3 className="loading-heading">Verifying Factual Claims</h3>
          <p className="loading-query-preview">&ldquo;{queryText}&rdquo;</p>
        </div>
      </div>

      <div className="pipeline-stepper">
        {pipelineStages.map((stage) => {
          const isDone = stage.id < currentStep;
          const isCurrent = stage.id === currentStep;

          return (
            <div
              key={stage.id}
              className={`stepper-stage ${isDone ? 'step-done' : ''} ${
                isCurrent ? 'step-current' : ''
              }`}
            >
              <div className="step-indicator-col">
                <div className="step-circle">
                  {isDone ? '✓' : stage.id}
                </div>
                {stage.id < 4 && <div className="step-line" />}
              </div>
              <div className="step-content">
                <span className="step-title">{stage.title}</span>
                <span className="step-desc">{stage.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="loading-footer-note">
        <span className="note-text">
          Simulating Phase 1 verification pipeline walkthrough (illustrative mock transition)
        </span>
      </div>
    </div>
  );
};

