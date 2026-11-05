import React from 'react';
import type { VerificationStatus } from '../../types';
import { CheckCircleIcon, CompassIcon, AlertTriangleIcon, HelpCircleIcon } from './Icons';

export const statusConfig: Record<
  VerificationStatus,
  {
    label: string;
    description: string;
    badgeClass: string;
    icon: React.ReactElement;
  }
> = {
  supported: {
    label: 'Supported',
    description: 'Directly corroborated by authoritative primary source evidence',
    badgeClass: 'badge-supported',
    icon: <CheckCircleIcon size={14} />,
  },
  inferred: {
    label: 'Inferred',
    description: 'Plausible logical deduction, but not verbatim stated in source text',
    badgeClass: 'badge-inferred',
    icon: <CompassIcon size={14} />,
  },
  contradicted: {
    label: 'Contradicted',
    description: 'Evidence directly disputes, refutes, or negates this claim',
    badgeClass: 'badge-contradicted',
    icon: <AlertTriangleIcon size={14} />,
  },
  insufficient: {
    label: 'Insufficient Evidence',
    description: 'Knowledge base lacks sufficient authoritative evidence to verify',
    badgeClass: 'badge-insufficient',
    icon: <HelpCircleIcon size={14} />,
  },
};

