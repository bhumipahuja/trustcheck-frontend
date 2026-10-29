import { Target, ScanResult, ScanDiff } from '../types';

const API_BASE = '/api';

export const ApiService = {
  async getTargets(): Promise<Target[]> {
    try {
      const res = await fetch(`${API_BASE}/targets`);
      if (!res.ok) throw new Error('Failed to fetch targets');
      const data = await res.json();
      return data.targets || [];
    } catch {
      return getMockTargets();
    }
  },

  async createTarget(hostname: string, displayName?: string): Promise<Target> {
    const res = await fetch(`${API_BASE}/targets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostname, displayName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create target');
    return data.target;
  },

  async deleteTarget(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/targets/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete target');
  },

  async triggerScan(targetId: string): Promise<{ scan: ScanResult; diff: ScanDiff }> {
    const res = await fetch(`${API_BASE}/scans/run/${targetId}`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Scan execution failed');
    return { scan: data.scan, diff: data.diff };
  },

  async adhocScan(urlOrDomain: string): Promise<{ target: Target; scan: ScanResult }> {
    const res = await fetch(`${API_BASE}/scans/adhoc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urlOrDomain }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ad-hoc scan failed');
    return { target: data.target, scan: data.scan };
  },

  async getTargetScans(targetId: string): Promise<{ scans: ScanResult[]; diff: ScanDiff | null }> {
    try {
      const res = await fetch(`${API_BASE}/scans/target/${targetId}`);
      if (!res.ok) throw new Error('Failed to fetch scan history');
      const data = await res.json();
      return { scans: data.scans || [], diff: data.diff || null };
    } catch {
      const mock = getMockScans(targetId);
      return { scans: mock, diff: null };
    }
  },

  async getScanDetails(scanId: string): Promise<ScanResult> {
    try {
      const res = await fetch(`${API_BASE}/scans/${scanId}`);
      if (!res.ok) throw new Error('Failed to fetch scan details');
      const data = await res.json();
      return data.scan;
    } catch {
      return getMockScans('mock')[0];
    }
  },
};

// Fallback sample data for immediate visual preview
function getMockTargets(): Target[] {
  return [
    {
      id: 'target-1',
      hostname: 'github.com',
      displayName: 'GitHub Production',
      protocol: 'https',
      port: 443,
      isActive: true,
      createdAt: '2026-10-20T10:00:00Z',
      updatedAt: '2026-10-28T14:30:00Z',
      lastScan: {
        id: 'scan-1',
        score: 92,
        totalFindings: 3,
        scannedAt: '2026-10-28T14:30:00Z',
      },
    },
    {
      id: 'target-2',
      hostname: 'legacy-portal.internal.net',
      displayName: 'Legacy Student Portal',
      protocol: 'https',
      port: 443,
      isActive: true,
      createdAt: '2026-10-15T08:00:00Z',
      updatedAt: '2026-10-27T09:15:00Z',
      lastScan: {
        id: 'scan-2',
        score: 54,
        totalFindings: 8,
        scannedAt: '2026-10-27T09:15:00Z',
      },
    },
  ];
}

function getMockScans(targetId: string): ScanResult[] {
  return [
    {
      id: 'scan-mock-1',
      targetId,
      hostname: 'example.com',
      healthScore: 78,
      status: 'COMPLETED',
      totalFindings: 4,
      criticalCount: 0,
      highCount: 1,
      mediumCount: 2,
      lowCount: 1,
      infoCount: 2,
      scanDurationMs: 642,
      createdAt: new Date().toISOString(),
      rawMetadata: {
        resolvedIps: ['93.184.216.34'],
        protocol: 'TLSv1.3',
        cipher: 'TLS_AES_256_GCM_SHA384',
      },
      findings: [
        {
          id: 'f-1',
          scanId: 'scan-mock-1',
          checkKey: 'CSP_MISSING',
          category: 'SECURITY_HEADERS',
          severity: 'HIGH',
          penaltyPoints: 15,
          title: 'Missing Content Security Policy (CSP)',
          description: 'A Content Security Policy protects against Cross-Site Scripting (XSS) and code injection.',
          evidence: 'Content-Security-Policy header is absent from HTTP response.',
          remediation: 'Configure a Content-Security-Policy header, e.g. Content-Security-Policy: default-src \'self\';',
        },
        {
          id: 'f-2',
          scanId: 'scan-mock-1',
          checkKey: 'HSTS_MISSING',
          category: 'SECURITY_HEADERS',
          severity: 'MEDIUM',
          penaltyPoints: 12,
          title: 'Missing Strict-Transport-Security (HSTS)',
          description: 'Enforces HTTPS encryption and prevents downgrade/stripping attacks.',
          evidence: 'Strict-Transport-Security header not returned.',
          remediation: 'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains',
        },
        {
          id: 'f-3',
          scanId: 'scan-mock-1',
          checkKey: 'DMARC_RECORD_MISSING',
          category: 'DNS_EMAIL',
          severity: 'MEDIUM',
          penaltyPoints: 8,
          title: 'Missing DMARC Email Security Policy',
          description: 'Without DMARC, unauthorized email senders can spoof your domain with no rejection enforcement.',
          evidence: 'No TXT record found at _dmarc.example.com',
          remediation: 'Publish a TXT record at _dmarc.example.com: v=DMARC1; p=quarantine;',
        },
        {
          id: 'f-4',
          scanId: 'scan-mock-1',
          checkKey: 'SERVER_HEADER_PRESENT',
          category: 'INFO_LEAK',
          severity: 'LOW',
          penaltyPoints: 1,
          title: 'Server Banner Disclosed',
          description: 'Web server identifies its software brand.',
          evidence: 'Server: ECS (dcb/7F83)',
          remediation: 'Suppress server identification tokens in reverse proxy configuration.',
        },
      ],
    },
  ];
}
