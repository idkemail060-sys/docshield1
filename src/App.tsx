/**
 * DocShield - AI-Based Fake Identity and Document Screening System
 * Smart India Hackathon (SIH26188)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { DocumentUploader } from './components/DocumentUploader';
import { PipelineProgress } from './components/PipelineProgress';
import { ResultsView } from './components/ResultsView';
import { ComplianceModal } from './components/ComplianceModal';
import { AboutUsModal } from './components/AboutUsModal';
import { DocumentType, ScreeningReport, AuditLogEntry, SampleDocumentPreset } from './types';
import { runScreeningPipeline } from './services/analyzer';

// Initial in-memory audit logs for realistic demonstration
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_1741254890',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    documentType: 'aadhaar',
    authenticityScore: 97,
    riskLevel: 'low',
    decision: 'ACCEPT',
    failedSignalsCount: 0,
    flagSummaries: ['Verhoeff verified', 'Clean ELA', 'Face match 96%'],
    executionTimeMs: 242,
    storageMode: 'RAM_ONLY_NO_PERSISTENCE'
  },
  {
    id: 'aud_1741254320',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    documentType: 'aadhaar',
    authenticityScore: 24,
    riskLevel: 'high',
    decision: 'REJECT',
    failedSignalsCount: 3,
    flagSummaries: ['Verhoeff Checksum Failed (Remainder 7)', 'ELA Heatmap Hotspot (DOB Altered)', 'Photoshop EXIF Tag'],
    executionTimeMs: 310,
    storageMode: 'RAM_ONLY_NO_PERSISTENCE'
  },
  {
    id: 'aud_1741253900',
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    documentType: 'pan',
    authenticityScore: 36,
    riskLevel: 'high',
    decision: 'REJECT',
    failedSignalsCount: 2,
    flagSummaries: ['Invalid PAN 4th Character Entity', 'Biometric Cosine Distance 0.66 (Different Person)'],
    executionTimeMs: 288,
    storageMode: 'RAM_ONLY_NO_PERSISTENCE'
  },
  {
    id: 'aud_1741253100',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    documentType: 'passport',
    authenticityScore: 61,
    riskLevel: 'medium',
    decision: 'MANUAL_REVIEW',
    failedSignalsCount: 2,
    flagSummaries: ['Synthetic GAN Spectral Artifacts in Portrait', 'Biometric Liveness Warning (Moiré Texture)'],
    executionTimeMs: 365,
    storageMode: 'RAM_ONLY_NO_PERSISTENCE'
  }
];

export default function App() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<ScreeningReport | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [isComplianceOpen, setIsComplianceOpen] = useState<boolean>(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState<boolean>(false);

  // Stored pending parameters during the stage animation
  const [pendingParams, setPendingParams] = useState<{
    docImage: string;
    selfieImage: string;
    docType: DocumentType;
    fileName: string;
    preset?: SampleDocumentPreset;
  } | null>(null);

  // Triggered when user clicks "Run Forensic Screening"
  const handleStartScreening = (params: {
    docImage: string;
    selfieImage: string;
    docType: DocumentType;
    fileName: string;
    preset?: SampleDocumentPreset;
  }) => {
    setPendingParams(params);
    setIsProcessing(true);
    setCurrentReport(null);
  };

  // Called when the 7-stage animated pipeline finishes
  const handlePipelineAnimationComplete = async () => {
    if (!pendingParams) {
      setIsProcessing(false);
      return;
    }

    try {
      const report = await runScreeningPipeline({
        docImageUrl: pendingParams.docImage,
        selfieImageUrl: pendingParams.selfieImage,
        docTypeHint: pendingParams.docType,
        fileName: pendingParams.fileName,
        presetData: pendingParams.preset?.mockData
      });

      setCurrentReport(report);

      // Record in memory audit log (strictly metadata, NO image bytes!)
      const newAuditLog: AuditLogEntry = {
        id: report.id,
        timestamp: report.timestamp,
        documentType: report.documentType,
        authenticityScore: report.authenticityScore,
        riskLevel: report.riskLevel,
        decision: report.decision,
        failedSignalsCount: report.forensicSignals.filter(s => s.status !== 'passed').length,
        flagSummaries: report.forensicSignals.filter(s => s.status !== 'passed').map(s => s.title),
        executionTimeMs: report.processingTimeMs,
        storageMode: 'RAM_ONLY_NO_PERSISTENCE'
      };

      setAuditLogs((prev) => [newAuditLog, ...prev]);
    } catch (err) {
      console.error('Screening execution error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetScreening = () => {
    setCurrentReport(null);
    setIsProcessing(false);
    setPendingParams(null);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        onOpenCompliance={() => setIsComplianceOpen(true)}
        onOpenAboutUs={() => setIsAboutUsOpen(true)}
        totalScreeningsCount={auditLogs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Screening Portal View */}
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PipelineProgress onComplete={handlePipelineAnimationComplete} />
            </motion.div>
          ) : currentReport ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ResultsView
                report={currentReport}
                onReset={handleResetScreening}
              />
            </motion.div>
          ) : (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DocumentUploader
                onStartScreening={handleStartScreening}
                isProcessing={isProcessing}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="bg-[#09090b] border-t border-zinc-800/80 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-zinc-400">DocShield Enterprise</span>
            <span className="text-zinc-600">•</span>
            <span>Smart India Hackathon (SIH26188)</span>
            <span className="text-zinc-600">•</span>
            <button
              id="btn-footer-about-us"
              onClick={() => setIsAboutUsOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-400"
            >
              About Team TechForge
            </button>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>NIST SP 800-63A</span>
            <span className="text-zinc-600">•</span>
            <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              RAM_ONLY_MODE: ENABLED (0 KB DISK)
            </span>
          </div>
        </div>
      </footer>

      {/* Compliance & Standards Modal */}
      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

      {/* Team TechForge About Us Modal */}
      <AboutUsModal
        isOpen={isAboutUsOpen}
        onClose={() => setIsAboutUsOpen(false)}
      />

    </div>
  );
}
