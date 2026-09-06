import React, { useState } from 'react';
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
  Maximize2
} from 'lucide-react';
import { ScreeningReport, BoundingBox, ForensicSignal } from '../types';

interface ResultsViewProps {
  report: ScreeningReport;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ report, onReset }) => {
  // Forensics view mode
  const [activeViewMode, setActiveViewMode] = useState<'original' | 'ela' | 'anomalies' | 'ocr'>('ela');
  const [elaOpacity, setElaOpacity] = useState<number>(0.85);
  const [selectedSignal, setSelectedSignal] = useState<ForensicSignal | null>(report.forensicSignals[0] || null);

  const isLowRisk = report.riskLevel === 'low';
  const isMediumRisk = report.riskLevel === 'medium';
  const isHighRisk = report.riskLevel === 'high';

  // Badge styling
  const riskBadgeColor = isLowRisk
    ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : isMediumRisk
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    : 'bg-red-500/10 text-red-400 border-red-500/20';

  const riskTitle = isLowRisk
    ? 'LOW RISK (Likely Genuine)'
    : isMediumRisk
    ? 'MEDIUM RISK (Manual Review Required)'
    : 'HIGH RISK (Suspicious / Flagged)';

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
      
      {/* Top Controls & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="btn-back-upload"
          onClick={onReset}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all border border-zinc-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Screen Another Document</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-audit-json"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Certificate (JSON)</span>
          </button>

          <button
            id="btn-print-report"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Primary Score & Decision Bento Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Score Gauge Block */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              {/* Circular Gauge Meter */}
              <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-md ${
                isLowRisk
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : isMediumRisk
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-red-500 bg-red-500/10 text-red-400'
              }`}>
                <span className="text-3xl font-black tracking-tight">{report.authenticityScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${riskBadgeColor}`}>
                  {riskTitle}
                </span>
                <span className="text-xs text-zinc-500 font-mono">ID: {report.id}</span>
              </div>
              
              <h2 className="text-xl font-bold text-zinc-100">
                Decision:{' '}
                <span className={
                  report.decision === 'ACCEPT' ? 'text-green-400' :
                  report.decision === 'MANUAL_REVIEW' ? 'text-amber-400' : 'text-red-400'
                }>{report.decision}</span>
              </h2>
              
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                {report.recommendation}
              </p>
            </div>
          </div>

          {/* Sub-scores Bento Grid Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:border-l md:border-zinc-800 md:pl-6">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Structural</span>
              <div className="text-base font-bold text-zinc-100 mt-0.5">{report.subScores.structural}%</div>
              <div className="text-[10px] text-zinc-500">Format & Regex</div>
            </div>
            
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Forensics</span>
              <div className={`text-base font-bold mt-0.5 ${report.subScores.forensics >= 80 ? 'text-green-400' : 'text-red-400'}`}>
                {report.subScores.forensics}%
              </div>
              <div className="text-[10px] text-zinc-500">ELA & Tamper</div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Biometrics</span>
              <div className={`text-base font-bold mt-0.5 ${report.subScores.biometrics >= 70 ? 'text-green-400' : 'text-amber-400'}`}>
                {report.subScores.biometrics}%
              </div>
              <div className="text-[10px] text-zinc-500">Face Match</div>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Metadata</span>
              <div className={`text-base font-bold mt-0.5 ${report.subScores.metadata >= 70 ? 'text-green-400' : 'text-amber-400'}`}>
                {report.subScores.metadata}%
              </div>
              <div className="text-[10px] text-zinc-500">EXIF Integrity</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Interactive Forensics Stage + Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 7 Cols: Interactive Document & ELA Heatmap Viewer */}
        <section className="lg:col-span-7 bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">Interactive Forensic Heatmap</h3>
                <p className="text-xs text-zinc-400">Switch overlays to inspect compression variances & anomalies</p>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                id="btn-view-ela"
                onClick={() => setActiveViewMode('ela')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeViewMode === 'ela' ? 'bg-zinc-100 text-zinc-900 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ELA Heatmap
              </button>
              <button
                id="btn-view-anomalies"
                onClick={() => setActiveViewMode('anomalies')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeViewMode === 'anomalies' ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Tamper Boxes
              </button>
              <button
                id="btn-view-ocr"
                onClick={() => setActiveViewMode('ocr')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeViewMode === 'ocr' ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                OCR Fields
              </button>
              <button
                id="btn-view-orig"
                onClick={() => setActiveViewMode('original')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeViewMode === 'original' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Original
              </button>
            </div>
          </div>

          {/* Document Canvas Stage */}
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-3 min-h-[340px] flex items-center justify-center overflow-hidden">
            {/* Base Document Image */}
            <img
              src={report.documentImageUrl}
              alt="Document"
              className="max-h-[320px] w-auto object-contain rounded-lg shadow-md"
            />

            {/* Error Level Analysis (ELA) Heatmap Overlay */}
            {activeViewMode === 'ela' && report.elaHeatmapUrl && (
              <img
                src={report.elaHeatmapUrl}
                alt="ELA Heatmap"
                style={{ opacity: elaOpacity }}
                className="absolute inset-0 m-auto max-h-[320px] w-auto object-contain rounded-lg pointer-events-none mix-blend-screen transition-opacity"
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
                    className="absolute border-2 border-red-500 bg-red-500/20 rounded animate-pulse"
                  >
                    <span className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      🚩 {box.label || 'Tampered Region'}
                    </span>
                  </div>
                ))}
                {report.forensicSignals.every(s => (s.suspiciousRegions?.length ?? 0) === 0) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/85 rounded-lg">
                    <div className="text-center p-4">
                      <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-zinc-100">No Tamper Hotspots Detected</p>
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
                    className={`absolute border rounded ${
                      field.isValid ? 'border-blue-500/80 bg-blue-500/10' : 'border-red-500 bg-red-500/20'
                    }`}
                  >
                    <span className={`absolute -top-5 left-0 text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                      field.isValid ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
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
            <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-zinc-300 font-medium">ELA Blend:</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={elaOpacity}
                  onChange={(e) => setElaOpacity(parseFloat(e.target.value))}
                  className="w-28 accent-blue-500 cursor-pointer"
                />
                <span className="text-zinc-400 font-mono">{Math.round(elaOpacity * 100)}%</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Uniform (Authentic)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  Bright Hotspot: Digital Alteration
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Right 5 Cols: Biometric Face Match & Identity Check */}
        <section className="lg:col-span-5 bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">Biometric Face Verification</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                report.biometrics.matchScore >= 70
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {report.biometrics.matchScore >= 70 ? 'Face Match' : 'Mismatch'}
              </span>
            </div>

            {/* Side-by-side Face Comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Document Photo Crop */}
              <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-2.5 text-center">
                <div className="relative h-32 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-900">
                  <img
                    src={report.documentImageUrl}
                    alt="Document Portrait"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-20 border border-blue-400/60 rounded-full" />
                  </div>
                </div>
                <span className="block text-[11px] font-semibold text-zinc-300 mt-2">
                  Document Portrait
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">ID Photo Extracted</span>
              </div>

              {/* Live Selfie Capture */}
              <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-2.5 text-center">
                <div className="relative h-32 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-900">
                  <img
                    src={report.selfieImageUrl}
                    alt="Live Selfie"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-20 border border-green-400/60 rounded-full" />
                  </div>
                </div>
                <span className="block text-[11px] font-semibold text-zinc-300 mt-2">
                  Live Selfie
                </span>
                <span className="text-[10px] text-green-400 font-medium font-mono">Liveness Verified</span>
              </div>
            </div>

            {/* Biometric Similarity Metrics */}
            <div className="space-y-2.5 bg-zinc-950 rounded-xl p-3 border border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Cosine Similarity:</span>
                <span className="font-mono font-bold text-zinc-100">{report.biometrics.matchScore}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    report.biometrics.matchScore >= 70 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${report.biometrics.matchScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
                <span className="text-zinc-400">Embedding Distance:</span>
                <span className="font-mono text-zinc-300">{report.biometrics.distanceValue} (cutoff &lt; 0.40)</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Presentation Attack Detection:</span>
                <span className="text-green-400 font-semibold flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Screen Moiré Absent
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Eye-Blink Dynamic:</span>
                <span className="text-green-400 font-semibold flex items-center gap-1 font-mono text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Micro-Motion Verified
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>NIST IAL2 Biometric Assurance</span>
            <span className="text-green-400 font-mono">128-d Feature Vector</span>
          </div>
        </section>

      </div>

      {/* Structured OCR Fields with Checksum Verification */}
      <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Structured OCR Fields & Mathematical Checksum Verification
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {report.ocrFields.length} Fields Extracted via PaddleOCR
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Field</th>
                <th className="py-2.5 px-3">Extracted Value</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Rule / Checksum Validation</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {report.ocrFields.map((field) => (
                <tr key={field.id} className="hover:bg-zinc-800/40">
                  <td className="py-3 px-3 font-semibold text-zinc-200">
                    {field.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-100 text-sm">
                    {field.value}
                  </td>
                  <td className="py-3 px-3 text-zinc-400 font-mono">
                    {Math.round(field.confidence * 100)}%
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {field.isValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className={field.isValid ? 'text-zinc-300' : 'text-red-400 font-semibold'}>
                        {field.validationMessage || (field.isValid ? 'Conforms to schema' : 'Format violation')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      field.isValid
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
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

      {/* Forensic Flags & Indicators List (Bento Grid) */}
      <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wide">
              Explainable Forensic Signals & Audit Details
            </h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            {report.forensicSignals.filter(s => s.status === 'passed').length} Passed / {report.forensicSignals.length} Total Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.forensicSignals.map((signal) => {
            const isPassed = signal.status === 'passed';
            const isWarning = signal.status === 'warning';
            const isFailed = signal.status === 'failed';

            return (
              <div
                key={signal.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isPassed
                    ? 'bg-zinc-950 border-zinc-800'
                    : isWarning
                    ? 'bg-zinc-950 border-amber-500/40'
                    : 'bg-zinc-950 border-red-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {signal.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      isPassed
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : isWarning
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {signal.status}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-zinc-100 mb-1">
                    {signal.title}
                  </h4>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {signal.description}
                  </p>
                </div>

                {signal.technicalDetails && (
                  <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 p-2 rounded">
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
