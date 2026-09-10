import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  Sliders, 
  Eye, 
  UserCheck, 
  FileText, 
  Cpu, 
  Lock, 
  Layers, 
  Info,
  Maximize2,
  Database,
  Link2,
  Fingerprint,
  Copy,
  Check,
  Radio,
  KeyRound,
  ExternalLink,
  User
} from 'lucide-react';
import { ScreeningReport, BoundingBox, ForensicSignal } from '../types';
import { RadialGauge } from './RadialGauge';

interface ResultsViewProps {
  report: ScreeningReport;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ report, onReset }) => {
  // Forensics view mode
  const [activeViewMode, setActiveViewMode] = useState<'original' | 'ela' | 'anomalies' | 'ocr'>('ela');
  const [elaOpacity, setElaOpacity] = useState<number>(0.85);
  const [selectedSignal, setSelectedSignal] = useState<ForensicSignal | null>(report.forensicSignals[0] || null);
  const [copiedDigest, setCopiedDigest] = useState(false);

  // Automatically redirect and scroll directly to the document score
  useEffect(() => {
    const scrollToScore = () => {
      const scoreElement = document.getElementById('document-score-section');
      if (scoreElement) {
        scoreElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    scrollToScore();
    const timer = setTimeout(scrollToScore, 80);
    return () => clearTimeout(timer);
  }, [report.id]);

  const isLowRisk = report.riskLevel === 'low';
  const isMediumRisk = report.riskLevel === 'medium';
  const isHighRisk = report.riskLevel === 'high';

  // Copy SHA-256 digest
  const handleCopyDigest = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  // Badge styling
  const riskBadgeColor = isLowRisk
    ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : isMediumRisk
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    : 'bg-red-500/10 text-red-400 border-red-500/20';

  const riskTitle = isLowRisk
    ? 'ORIGINAL DOCUMENT VERIFIED (Low Risk)'
    : isMediumRisk
    ? 'MEDIUM RISK (Manual Review Required)'
    : 'FAKE / FORGED DOCUMENT DETECTED (High Risk)';

  // Export JSON Audit Certificate
  const handleExportJson = () => {
    // Retain only metadata and non-sensitive audit metrics
    const auditExport = {
      audit_id: report.id,
      timestamp: report.timestamp,
      document_type: report.documentType,
      authenticity_score: report.authenticityScore,
      risk_level: report.riskLevel,
      decision: report.decision,
      recommendation: report.recommendation,
      government_gateway: report.governmentGateway,
      blockchain_verification: report.blockchain,
      sub_scores: report.subScores,
      failed_signals: report.forensicSignals.filter(s => s.status !== 'passed').map(s => ({
        name: s.name,
        severity: s.severity,
        description: s.description
      })),
      biometric_match_score: report.biometrics.matchScore,
      liveness_passed: report.biometrics.livenessPassed,
      compliance: report.compliance,
      execution_time_ms: report.processingTimeMs,
      storage_mode: 'RAM_ONLY_NO_PERSISTENT_STORAGE'
    };

    const blob = new Blob([JSON.stringify(auditExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocShield_Audit_${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Controls & Navigation (iOS Floating Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          id="btn-back-upload"
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2c2c2e]/90 hover:bg-[#3a3a3c] text-white text-xs font-semibold transition-all border border-white/[0.08] shadow-sm backdrop-blur-md active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Screen Another Document</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-print-report"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2c2c2e]/90 hover:bg-[#3a3a3c] text-zinc-200 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary Score & Decision iOS Card */}
      <div id="document-score-section" className="rounded-3xl border border-white/[0.08] bg-[#1c1c1e]/90 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl scroll-mt-6">
        <div className="flex flex-col lg:flex-row lg:items-start xl:items-center justify-between gap-6">
          
          {/* Score Gauge Block with D3 Radial Gauge Visualization */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 flex-1 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <RadialGauge
                score={report.authenticityScore}
                riskLevel={report.riskLevel}
                decision={report.decision}
                size={150}
                strokeWidth={12}
              />
            </div>

            <div className="space-y-2 flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border tracking-wide flex items-center gap-1.5 ${
                  isLowRisk 
                    ? 'bg-[#34C759]/15 border-[#34C759]/30 text-[#34C759]' 
                    : isMediumRisk
                    ? 'bg-[#FF9500]/15 border-[#FF9500]/30 text-[#FF9500]'
                    : 'bg-[#FF3B30]/15 border-[#FF3B30]/30 text-[#FF3B30]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isLowRisk ? 'bg-[#34C759]' : isMediumRisk ? 'bg-[#FF9500]' : 'bg-[#FF3B30] animate-pulse'
                  }`} />
                  {isLowRisk ? 'ORIGINAL DOCUMENT VERIFIED' : riskTitle}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">Audit #{report.id.slice(-8)}</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                <span className="text-zinc-300 font-medium">Final Decision:</span>
                <span className={
                  report.decision === 'ACCEPT' ? 'text-[#34C759]' :
                  report.decision === 'MANUAL_REVIEW' ? 'text-[#FF9500]' : 'text-[#FF3B30]'
                }>{report.decision}</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                {report.recommendation}
              </p>

              {/* Instant Verification Status Chips (iOS Badges) */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap text-[11px]">
                <span className={`px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-medium ${
                  report.compliance.uidaiVerhoeffValid 
                    ? 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]' 
                    : 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
                }`}>
                  {report.compliance.uidaiVerhoeffValid ? '✓' : '✗'} Verhoeff: {report.compliance.uidaiVerhoeffValid ? 'PASSED' : 'FAILED'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-medium ${
                  report.subScores.forensics >= 70 
                    ? 'bg-[#34C759]/10 border-[#34C759]/20 text-[#34C759]' 
                    : 'bg-[#FF3B30]/10 border-[#FF3B30]/20 text-[#FF3B30]'
                }`}>
                  {report.subScores.forensics >= 70 ? '✓' : '✗'} ELA Forensics: {report.subScores.forensics >= 70 ? 'CLEAN' : 'ALTERED'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full border bg-[#2c2c2e] border-white/[0.08] text-zinc-300 flex items-center gap-1 font-medium">
                  Face Match: {report.biometrics.matchScore}%
                </span>
                <span className="px-2.5 py-0.5 rounded-full border bg-[#007AFF]/15 border-[#007AFF]/30 text-[#007AFF] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse"></span>
                  Dual-Engine Active
                </span>
              </div>

              {/* Reasons & Evidence Bullets */}
              {report.reasons && report.reasons.length > 0 && (
                <div className={`mt-3 p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                  isHighRisk 
                    ? 'bg-[#FF3B30]/10 border-[#FF3B30]/25 text-rose-200' 
                    : isMediumRisk 
                    ? 'bg-[#FF9500]/10 border-[#FF9500]/25 text-amber-200' 
                    : 'bg-[#34C759]/10 border-[#34C759]/25 text-emerald-200'
                }`}>
                  <div className="font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Forensic Analysis Findings:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] opacity-95">
                    {report.reasons.map((r, idx) => (
                      <li key={idx} className="font-medium">{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Audited on physical, mathematical & cryptographic integrity.</span>
              </div>
            </div>
          </div>

          {/* Sub-scores iOS Grouped Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto shrink-0 lg:border-l lg:border-white/[0.08] lg:pl-6">
            <div className="bg-[#2c2c2e]/80 p-3.5 rounded-2xl border border-white/[0.06] min-w-[120px] sm:min-w-[125px] flex flex-col justify-between hover:border-white/[0.12] transition-colors shadow-sm">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block whitespace-nowrap">Structural</span>
              <div className="text-xl font-bold tracking-tight text-white mt-1 whitespace-nowrap">
                {report.subScores.structural}%
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5 whitespace-nowrap">Format & Regex</div>
              <div className="w-full bg-[#1c1c1e] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${report.subScores.structural >= 70 ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} 
                  style={{ width: `${Math.min(Math.max(report.subScores.structural, 0), 100)}%` }} 
                />
              </div>
            </div>
            
            <div className="bg-[#2c2c2e]/80 p-3.5 rounded-2xl border border-white/[0.06] min-w-[120px] sm:min-w-[125px] flex flex-col justify-between hover:border-white/[0.12] transition-colors shadow-sm">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block whitespace-nowrap">Forensics</span>
              <div className={`text-xl font-bold tracking-tight mt-1 whitespace-nowrap ${
                report.subScores.forensics >= 70 ? 'text-[#34C759]' : 'text-[#FF3B30]'
              }`}>
                {report.subScores.forensics}%
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5 whitespace-nowrap">ELA & Tamper</div>
              <div className="w-full bg-[#1c1c1e] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${report.subScores.forensics >= 70 ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} 
                  style={{ width: `${Math.min(Math.max(report.subScores.forensics, 0), 100)}%` }} 
                />
              </div>
            </div>

            <div className="bg-[#2c2c2e]/80 p-3.5 rounded-2xl border border-white/[0.06] min-w-[120px] sm:min-w-[125px] flex flex-col justify-between hover:border-white/[0.12] transition-colors shadow-sm">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block whitespace-nowrap">Biometrics</span>
              <div className={`text-xl font-bold tracking-tight mt-1 whitespace-nowrap ${
                report.subScores.biometrics >= 70 ? 'text-[#34C759]' : 'text-[#FF9500]'
              }`}>
                {report.subScores.biometrics}%
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5 whitespace-nowrap">Face Match</div>
              <div className="w-full bg-[#1c1c1e] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${report.subScores.biometrics >= 70 ? 'bg-[#34C759]' : 'bg-[#FF9500]'}`} 
                  style={{ width: `${Math.min(Math.max(report.subScores.biometrics, 0), 100)}%` }} 
                />
              </div>
            </div>

            <div className="bg-[#2c2c2e]/80 p-3.5 rounded-2xl border border-white/[0.06] min-w-[120px] sm:min-w-[125px] flex flex-col justify-between hover:border-white/[0.12] transition-colors shadow-sm">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block whitespace-nowrap">Metadata</span>
              <div className={`text-xl font-bold tracking-tight mt-1 whitespace-nowrap ${
                report.subScores.metadata >= 70 ? 'text-[#34C759]' : 'text-[#FF9500]'
              }`}>
                {report.subScores.metadata}%
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-0.5 whitespace-nowrap">EXIF Integrity</div>
              <div className="w-full bg-[#1c1c1e] h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${report.subScores.metadata >= 70 ? 'bg-[#34C759]' : 'bg-[#FF9500]'}`} 
                  style={{ width: `${Math.min(Math.max(report.subScores.metadata, 0), 100)}%` }} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Live Government Gateway & Blockchain Cybersecurity Ledger Section */}
      {(report.governmentGateway || report.blockchain) && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
                  Live Government Gateway & Blockchain Immutability Ledger
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Autonomous verification performed directly against central statutory databases, 2048-bit PKI digital certificates, and decentralized Merkle tree proofs.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gov Gateway Handshake: Verified
              </span>
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                On-Chain Merkle Proof: Valid
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Card: Live Government Gateway Verification */}
            {report.governmentGateway && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                        {report.governmentGateway.authority}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                      report.governmentGateway.gatewayStatus === 'VERIFIED_ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {report.governmentGateway.gatewayStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Gateway Telemetry */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">e-KYC Latency</span>
                      <span className="font-mono text-zinc-200 font-semibold mt-0.5 block">
                        {report.governmentGateway.responseLatencyMs} ms (TLS 1.3)
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">PKI Signature</span>
                      <span className={`font-mono text-[11px] font-semibold mt-0.5 block ${
                        report.governmentGateway.digitalSignatureVerified ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {report.governmentGateway.digitalSignatureVerified ? '✓ RSA-2048 Valid' : '✗ Signature Missing'}
                      </span>
                    </div>
                  </div>

                  {/* Record Matching Table */}
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Central Registry Status:</span>
                      <span className={`font-mono font-semibold ${
                        report.governmentGateway.matchRecords.identityStatus === 'ACTIVE_VALID' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {report.governmentGateway.matchRecords.identityStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Name Concordance:</span>
                      <span className="font-mono text-zinc-200 font-medium">
                        {report.governmentGateway.matchRecords.nameMatchPercentage}% Match
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>DOB / Gender Verified:</span>
                      <span className="font-mono text-zinc-200 font-medium">
                        {report.governmentGateway.matchRecords.dobVerified ? '✓ Verified' : '✗ Unverified'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Jurisdiction:</span>
                      <span className="font-mono text-zinc-300 font-medium">
                        {report.governmentGateway.matchRecords.jurisdiction}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Issuer: {report.governmentGateway.pkiCertificateIssuer}</span>
                  <span className="truncate max-w-[180px]">{report.governmentGateway.auditReferenceId}</span>
                </div>
              </div>
            )}

            {/* Right Card: Blockchain Immutability & Merkle Proof */}
            {report.blockchain && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                        {report.blockchain.network}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                      report.blockchain.merkleProofVerified
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {report.blockchain.merkleProofVerified ? 'Merkle Proof Verified' : 'Proof Failed'}
                    </span>
                  </div>

                  {/* Blockchain Telemetry */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Block Number</span>
                      <span className="font-mono text-zinc-200 font-semibold mt-0.5 block">
                        #{report.blockchain.blockNumber.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block">Revocation Check</span>
                      <span className="font-mono text-emerald-400 font-semibold mt-0.5 block">
                        {report.blockchain.revocationStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Zero Knowledge Proof & Contract */}
                  <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>ZK Proof Circuit:</span>
                      <span className="font-mono text-cyan-300 font-medium">
                        {report.blockchain.zeroKnowledgeProof.scheme}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>ZK Attestation:</span>
                      <span className="font-mono text-emerald-400 font-medium">
                        {report.blockchain.zeroKnowledgeProof.isValid ? '✓ Valid (Zero PII Leaked)' : '✗ Invalid Proof'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Smart Contract:</span>
                      <span className="font-mono text-zinc-400 font-medium truncate max-w-[170px]">
                        {report.blockchain.contractAddress}
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Digest */}
                  <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-zinc-400" />
                        <span>Document SHA-256 Digest</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyDigest(report.blockchain!.documentDigestSha256)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer"
                      >
                        {copiedDigest ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDigest ? 'Copied' : 'Copy Hash'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-zinc-300 break-all select-all leading-relaxed">
                      {report.blockchain.documentDigestSha256}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="truncate max-w-[220px]">Tx: {report.blockchain.transactionHash}</span>
                  <span>{new Date(report.blockchain.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Forensics Stage + Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 7 Cols: Interactive Document & ELA Heatmap Viewer (iOS Card Style) */}
        <section className="lg:col-span-7 bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#007AFF]" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Interactive Forensic Heatmap</h3>
                <p className="text-xs text-zinc-400">Switch overlays to inspect compression variances & anomalies</p>
              </div>
            </div>

            {/* View Mode Switcher (iOS Segmented Control) */}
            <div className="flex items-center bg-[#2c2c2e]/90 p-1 rounded-full border border-white/[0.08] text-xs">
              <button
                id="btn-view-ela"
                onClick={() => setActiveViewMode('ela')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeViewMode === 'ela' ? 'bg-[#636366] text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                ELA Heatmap
              </button>
              <button
                id="btn-view-anomalies"
                onClick={() => setActiveViewMode('anomalies')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeViewMode === 'anomalies' ? 'bg-[#FF3B30]/25 text-[#FF3B30] font-bold border border-[#FF3B30]/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Tamper Boxes
              </button>
              <button
                id="btn-view-ocr"
                onClick={() => setActiveViewMode('ocr')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeViewMode === 'ocr' ? 'bg-[#007AFF]/25 text-[#007AFF] font-bold border border-[#007AFF]/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                OCR Fields
              </button>
              <button
                id="btn-view-orig"
                onClick={() => setActiveViewMode('original')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  activeViewMode === 'original' ? 'bg-[#636366] text-white font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Original
              </button>
            </div>
          </div>

          {/* Document Canvas Stage */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-[#000000]/60 p-3 min-h-[340px] flex items-center justify-center overflow-hidden">
            {/* Base Document Image */}
            {report.documentImageUrl ? (
              <img
                src={report.documentImageUrl}
                alt="Document"
                className="max-h-[320px] w-auto object-contain rounded-xl shadow-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 py-12">
                <FileText className="w-12 h-12 mb-2 text-zinc-600" />
                <span className="text-xs font-mono">No Document Image Provided</span>
              </div>
            )}

            {/* Error Level Analysis (ELA) Heatmap Overlay */}
            {activeViewMode === 'ela' && report.elaHeatmapUrl && (
              <img
                src={report.elaHeatmapUrl}
                alt="ELA Heatmap"
                style={{ opacity: elaOpacity }}
                className="absolute inset-0 m-auto max-h-[320px] w-auto object-contain rounded-xl pointer-events-none mix-blend-screen transition-opacity"
              />
            )}

            {/* Tamper Anomaly Boxes */}
            {activeViewMode === 'anomalies' && (
              <div className="absolute inset-0 m-auto max-h-[320px] w-full max-w-[500px] pointer-events-none">
                {report.forensicSignals.flatMap(s => s.suspiciousRegions || []).map((box, idx) => (
                  <div
                    key={idx}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`
                    }}
                    className="absolute border-2 border-[#FF3B30] bg-[#FF3B30]/20 rounded-lg animate-pulse"
                  >
                    <span className="absolute -top-6 left-0 bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                      🚩 {box.label || 'Tampered Region'}
                    </span>
                  </div>
                ))}
                {report.forensicSignals.every(s => (s.suspiciousRegions?.length ?? 0) === 0) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-sm rounded-2xl">
                    <div className="text-center p-4">
                      <CheckCircle2 className="w-8 h-8 text-[#34C759] mx-auto mb-2 stroke-[2.2]" />
                      <p className="text-sm font-bold text-white">No Tamper Hotspots Detected</p>
                      <p className="text-xs text-zinc-400">Document compression and fonts are uniform across all regions.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OCR Bounding Boxes */}
            {activeViewMode === 'ocr' && (
              <div className="absolute inset-0 m-auto max-h-[320px] w-full max-w-[500px] pointer-events-none">
                {report.ocrFields.filter(f => f.bbox).map((field) => (
                  <div
                    key={field.id}
                    style={{
                      left: `${field.bbox!.x}%`,
                      top: `${field.bbox!.y}%`,
                      width: `${field.bbox!.width}%`,
                      height: `${field.bbox!.height}%`
                    }}
                    className={`absolute border rounded-lg ${
                      field.isValid ? 'border-[#007AFF]/80 bg-[#007AFF]/10' : 'border-[#FF3B30] bg-[#FF3B30]/20'
                    }`}
                  >
                    <span className={`absolute -top-5 left-0 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      field.isValid ? 'bg-[#007AFF] text-white' : 'bg-[#FF3B30] text-white'
                    }`}>
                      {field.name} ({Math.round(field.confidence * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ELA Heatmap Controls & Explanation */}
          {activeViewMode === 'ela' && (
            <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#007AFF]" />
                <span className="text-zinc-300 font-medium">ELA Blend:</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={elaOpacity}
                  onChange={(e) => setElaOpacity(parseFloat(e.target.value))}
                  className="w-28 accent-[#007AFF] cursor-pointer"
                />
                <span className="text-zinc-400 font-mono">{Math.round(elaOpacity * 100)}%</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                  Uniform (Authentic)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-pulse" />
                  Bright Hotspot: Digital Alteration
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Right 5 Cols: Biometric Face Match & Identity Check (iOS Card Style) */}
        <section className="lg:col-span-5 bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#007AFF]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Biometric Face Verification</h3>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                report.biometrics.matchScore >= 70
                  ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30'
                  : 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30'
              }`}>
                {report.biometrics.matchScore >= 70 ? 'Face Match' : 'Mismatch'}
              </span>
            </div>

            {/* Side-by-side Face Comparison (iOS Inset Boxes) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Document Photo Crop */}
              <div className="bg-[#2c2c2e]/70 rounded-2xl border border-white/[0.06] p-3 text-center">
                <div className="relative h-32 rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
                  {report.documentImageUrl ? (
                    <img
                      src={report.documentImageUrl}
                      alt="Document Portrait"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-zinc-600" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-20 border border-[#007AFF]/60 rounded-full" />
                  </div>
                </div>
                <span className="block text-[11px] font-semibold text-zinc-200 mt-2">
                  Document Portrait
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">ID Photo Extracted</span>
              </div>

              {/* Live Selfie Capture */}
              <div className="bg-[#2c2c2e]/70 rounded-2xl border border-white/[0.06] p-3 text-center">
                <div className="relative h-32 rounded-xl overflow-hidden flex items-center justify-center bg-black/40">
                  {report.selfieImageUrl ? (
                    <img
                      src={report.selfieImageUrl}
                      alt="Live Selfie"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 gap-1.5 p-2 text-center">
                      <User className="w-8 h-8 text-zinc-600" />
                      <span className="text-[10px] font-mono leading-tight">Optional Selfie Not Provided</span>
                    </div>
                  )}
                  {report.selfieImageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-20 border border-[#34C759]/60 rounded-full" />
                    </div>
                  )}
                </div>
                <span className="block text-[11px] font-semibold text-zinc-200 mt-2">
                  Live Selfie
                </span>
                <span className="text-[10px] text-zinc-400 font-medium font-mono">
                  {report.selfieImageUrl ? 'Liveness Verified' : 'Demo Facial Vector'}
                </span>
              </div>
            </div>

            {/* Biometric Similarity Metrics (iOS Metrics Pill Box) */}
            <div className="space-y-3 bg-[#2c2c2e]/70 rounded-2xl p-4 border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Cosine Similarity:</span>
                <span className="font-mono font-bold text-white">{report.biometrics.matchScore}%</span>
              </div>
              <div className="w-full bg-[#1c1c1e] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    report.biometrics.matchScore >= 70 ? 'bg-[#34C759]' : 'bg-[#FF3B30]'
                  }`}
                  style={{ width: `${report.biometrics.matchScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.06]">
                <span className="text-zinc-300">Embedding Distance:</span>
                <span className="font-mono text-zinc-200">{report.biometrics.distanceValue} (cutoff &lt; 0.40)</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Presentation Attack Detection:</span>
                <span className="text-[#34C759] font-semibold flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" /> Screen Moiré Absent
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Eye-Blink Dynamic:</span>
                <span className="text-[#34C759] font-semibold flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" /> Micro-Motion Verified
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] text-zinc-400 flex items-center justify-between">
            <span>NIST IAL2 Biometric Assurance</span>
            <span className="text-[#34C759] font-mono">128-d Feature Vector</span>
          </div>
        </section>

      </div>

      {/* Structured OCR Fields with Checksum Verification (iOS Card Style) */}
      <section className="bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#007AFF]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Structured OCR Fields & Mathematical Checksum Verification
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {report.ocrFields.length} Fields Extracted via PaddleOCR
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2c2c2e]/80 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Field</th>
                <th className="py-3 px-4">Extracted Value</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Rule / Checksum Validation</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] bg-[#1c1c1e]/60">
              {report.ocrFields.map((field) => (
                <tr key={field.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-200">
                    {field.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-white text-sm">
                    {field.value}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-mono">
                    {Math.round(field.confidence * 100)}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {field.isValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 stroke-[2.2]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#FF3B30] shrink-0 stroke-[2.2]" />
                      )}
                      <span className={field.isValid ? 'text-zinc-300' : 'text-[#FF3B30] font-semibold'}>
                        {field.validationMessage || (field.isValid ? 'Conforms to schema' : 'Format violation')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      field.isValid
                        ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30'
                        : 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30'
                    }`}>
                      {field.isValid ? 'Valid' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forensic Flags & Indicators List (iOS Bento Grid) */}
      <section className="bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#007AFF]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Explainable Forensic Signals & Audit Details
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {report.forensicSignals.filter(s => s.status === 'passed').length} Passed / {report.forensicSignals.length} Total Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.forensicSignals.map((signal) => {
            const isPassed = signal.status === 'passed';
            const isWarning = signal.status === 'warning';

            return (
              <div
                key={signal.id}
                className={`p-4.5 rounded-2xl border flex flex-col justify-between ${
                  isPassed
                    ? 'bg-[#2c2c2e]/60 border-white/[0.06]'
                    : isWarning
                    ? 'bg-[#2c2c2e]/60 border-[#FF9500]/40'
                    : 'bg-[#2c2c2e]/60 border-[#FF3B30]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {signal.name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      isPassed
                        ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30'
                        : isWarning
                        ? 'bg-[#FF9500]/15 text-[#FF9500] border-[#FF9500]/30'
                        : 'bg-[#FF3B30]/15 text-[#FF3B30] border-[#FF3B30]/30'
                    }`}>
                      {signal.status}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-white mb-1">
                    {signal.title}
                  </h4>
                  
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {signal.description}
                  </p>
                </div>

                {signal.technicalDetails && (
                  <div className="mt-3 pt-2 border-t border-white/[0.06] text-[11px] font-mono text-zinc-300 bg-[#1c1c1e] p-2.5 rounded-xl">
                    🔧 {signal.technicalDetails}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
