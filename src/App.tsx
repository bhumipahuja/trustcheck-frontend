import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ScanReport } from './pages/ScanReport';
import { RegressionDiff } from './pages/RegressionDiff';
import { ScanModal } from './components/ScanModal';
import { ApiService } from './services/api';
import { Target, ScanResult, ScanDiff } from './types';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'report' | 'diff'>('dashboard');
  const [targets, setTargets] = useState<Target[]>([]);
  const [activeTarget, setActiveTarget] = useState<Target | null>(null);
  const [activeScan, setActiveScan] = useState<ScanResult | null>(null);
  const [activeDiff, setActiveDiff] = useState<ScanDiff | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load initial targets on component mount
  useEffect(() => {
    loadTargets();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadTargets = async () => {
    try {
      const data = await ApiService.getTargets();
      setTargets(data);
      if (data.length > 0 && !activeTarget) {
        setActiveTarget(data[0]);
        // Also fetch latest scan for default target
        loadTargetScans(data[0].id);
      }
    } catch (err: unknown) {
      console.error('Error fetching targets:', err);
    }
  };

  const loadTargetScans = async (targetId: string) => {
    try {
      const { scans, diff } = await ApiService.getTargetScans(targetId);
      if (scans.length > 0) {
        setActiveScan(scans[0]);
      }
      setActiveDiff(diff);
    } catch (err) {
      console.error('Error fetching scans:', err);
    }
  };

  const handleSelectTarget = (target: Target) => {
    setActiveTarget(target);
    loadTargetScans(target.id);
    setActiveView('report');
  };

  const handleTriggerScan = async (targetId: string) => {
    setIsScanning(true);
    try {
      const result = await ApiService.triggerScan(targetId);
      setActiveScan(result.scan);
      setActiveDiff(result.diff);
      showNotification(`Scan complete for target. Score: ${result.scan.healthScore}/100`);
      await loadTargets();
      setActiveView('report');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showNotification(message, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCreateAndScan = async (domain: string, displayName?: string) => {
    setIsScanning(true);
    try {
      const { target, scan } = await ApiService.adhocScan(domain);
      setActiveTarget(target);
      setActiveScan(scan);
      setActiveDiff(null);
      await loadTargets();
      showNotification(`Assessment completed for ${target.hostname}!`);
      setActiveView('report');
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeleteTarget = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this target?')) return;
    try {
      await ApiService.deleteTarget(id);
      showNotification('Target removed successfully');
      loadTargets();
      if (activeTarget?.id === id) {
        setActiveTarget(null);
        setActiveScan(null);
        setActiveDiff(null);
        setActiveView('dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showNotification(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenNewScan={() => setIsModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        isScanning={isScanning}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div
            className={`p-4 rounded-xl border shadow-xl flex items-center gap-3 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/90 border-rose-500/40 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <Dashboard
            targets={targets}
            onSelectTarget={handleSelectTarget}
            onTriggerScan={handleTriggerScan}
            onDeleteTarget={handleDeleteTarget}
            onOpenNewScan={() => setIsModalOpen(true)}
            isScanning={isScanning}
            activeScan={activeScan}
          />
        )}

        {activeView === 'report' && (
          <ScanReport
            scan={activeScan}
            onRerunScan={handleTriggerScan}
            isScanning={isScanning}
          />
        )}

        {activeView === 'diff' && (
          <RegressionDiff
            diff={activeDiff}
            targetHostname={activeTarget?.hostname || activeScan?.hostname || 'example.com'}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          TrustCheck © 2026 — Designed for CSE Adhoc & Wireless/Web Security Engineering Project-II
        </p>
      </footer>

      {/* New Scan Modal */}
      <ScanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAndScan}
        isScanning={isScanning}
      />
    </div>
  );
};
