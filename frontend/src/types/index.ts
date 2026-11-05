export type VerificationStatus =
  | 'supported'
  | 'inferred'
  | 'contradicted'
  | 'insufficient';

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  authors?: string;
  publicationDate?: string;
  excerpt: string;
  relevanceScore: number; // e.g. 0.94
  badgeType: 'Primary Source' | 'Corroborating Source' | 'Refuting Source' | 'Contextual Source';
}

export interface GroundedClaim {
  id: string;
  claimNumber: number;
  text: string;
  status: VerificationStatus;
  mockConfidence: number; // 0-100
  verdictExplanation: string;
  evidenceIds: string[];
  excerptHighlight?: string;
}

export interface AnswerParagraph {
  id: string;
  text: string;
  claimIds: string[];
}

export interface ResearchQueryItem {
  id: string;
  query: string;
  timestamp: string;
  domainCategory: string;
  summary: string;
  paragraphs: AnswerParagraph[];
  claims: GroundedClaim[];
  evidence: EvidenceSource[];
  mockConfidenceScore: number;
  groundingMetrics: {
    supported: number;
    inferred: number;
    contradicted: number;
    insufficient: number;
  };
}

export interface HistorySession {
  id: string;
  title: string;
  preview: string;
  timeAgo: string;
  group: 'Today' | 'Yesterday' | 'Previous 7 Days';
  confidenceLabel: string;
  claimsCount: number;
  queryId: string;
}

export interface AppSettings {
  verificationThreshold: 'strict' | 'standard' | 'exploratory';
  evidenceSourceFilter: 'all' | 'peer-reviewed' | 'official-docs' | 'news';
  displayFootnotes: boolean;
  highlightContradictions: boolean;
  uiTheme: 'system' | 'light' | 'dark';
}

