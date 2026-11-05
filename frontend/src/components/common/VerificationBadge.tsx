import React from 'react';
import type { VerificationStatus } from '../../types';
import { statusConfig } from './statusConfig';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  interactive = false,
  onClick,
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={`verification-badge ${config.badgeClass} size-${size} ${
        interactive ? 'badge-interactive' : ''
      }`}
      title={config.description}
      role={interactive ? 'button' : 'status'}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {showIcon && <span className="badge-icon-wrap">{config.icon}</span>}
      <span className="badge-label">{config.label}</span>
    </span>
  );
};
