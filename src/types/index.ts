export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export type CheckCategory =
  | 'SSL_TLS'
  | 'SECURITY_HEADERS'
  | 'COOKIES'
  | 'DNS_EMAIL'
  | 'INFO_LEAK';

export interface Finding {
  id: string;
  scanId: string;
  checkKey: string;
  category: CheckCategory;
  severity: Severity;
  penaltyPoints: number;
  title: string;
  description: string;
  evidence: string;
  remediation: string;
}

export interface Target {
  id: string;
  hostname: string;
  displayName?: string;
  protocol: 'http' | 'https';
  port: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastScan?: {
    id: string;
    score: number;
    totalFindings: number;
    scannedAt: string;
  } | null;
}

export interface ScanResult {
  id: string;
  targetId: string;
  hostname: string;
  healthScore: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  scanDurationMs: number;
  rawMetadata: Record<string, any>;
  findings: Finding[];
  createdAt: string;
}

export interface ScanDiff {
  id?: string;
  targetId: string;
  currentScanId: string;
  previousScanId?: string;
  scoreDelta: number;
  newFindings: Finding[];
  resolvedFindings: Finding[];
  persistentFindings: Finding[];
  createdAt: string;
}
