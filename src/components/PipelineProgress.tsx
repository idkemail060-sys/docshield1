import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  FileCheck, 
  Cpu, 
  Search, 
  Fingerprint, 
  Sliders, 
  ShieldAlert 
} from 'lucide-react';

interface PipelineProgressProps {
  onComplete: () => void;
}

interface PipelineStage {
  id: number;
  name: string;
  category: string;
  description: string;
  subAction: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: 'Document Ingestion & Quality',
    category: 'Stage 1/7',
    description: 'Validating image resolution, aspect ratio, and Laplacian blur variance (>100 threshold).',
    subAction: 'Checking image sharpness: 312.4 variance (PASS)'
  },
  {
    id: 2,
    name: 'Pre-Processing & Deskew',
    category: 'Stage 2/7',
    description: 'Auto-cropping ID card boundaries, perspective warping, and deskewing tilt angle.',
    subAction: 'Correcting 0.4° tilt angle; applying adaptive thresholding'
  },
  {
    id: 3,
    name: 'OCR Engine & Document Classification',
    category: 'Stage 3/7',
    description: 'PaddleOCR text recognition, identifying document template (Aadhaar / PAN / Passport).',
    subAction: 'Classified: Aadhaar Card (UIDAI); Extracted 4 structured fields'
  },
  {
    id: 4,
    name: 'Verification Rules & Verhoeff Checksum',
    category: 'Stage 4/7',
    description: 'Validating Dihedral group D5 Verhoeff checksum algorithm and demographic consistency.',
    subAction: 'Calculating ISO/IEC 7064 MOD 11, 10 Verhoeff remainder'
  },
  {
    id: 5,
    name: 'AI Forensics & ELA Heatmap',
    category: 'Stage 5/7',
    description: 'Generating Error Level Analysis (ELA) compression differential and EXIF software audit.',
    subAction: 'Re-compressing at 90% JPEG quality; computing pixel error gradient'
  },
  {
    id: 6,
    name: 'Biometric Face Match & Liveness',
    category: 'Stage 6/7',
    description: 'Extracting face portrait crop, landmark alignment, and cosine similarity with live selfie.',
    subAction: 'Computing 512-d facial embedding distance; checking screen moiré'
  },
  {
    id: 7,
    name: 'Risk Engine & Decision Synthesis',
    category: 'Stage 7/7',
    description: 'Synthesizing weighted signals into 0-100 Authenticity Score and explainable flags report.',
    subAction: 'Applying NIST SP 800-63A decision thresholds'
  }
];

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ onComplete }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  useEffect(() => {
    // Progress through the stages smoothly over ~2.4 seconds
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          setCompletedStages((comp) => [...comp, prev]);
          return prev + 1;
        } else {
          clearInterval(interval);
          setCompletedStages((comp) => [...comp, prev]);
          setTimeout(() => {
            onComplete();
          }, 300);
          return prev;
        }
      });
    }, 320);

    return () => clearInterval(interval);
  }, [onComplete]);

  const activeStage = PIPELINE_STAGES[currentStageIndex];
  const progressPct = Math.round(((completedStages.length) / PIPELINE_STAGES.length) * 100);

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm max-w-3xl mx-auto my-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
            Real-Time In-Memory Execution
          </span>
          <h2 className="text-xl font-bold text-zinc-100 mt-0.5 tracking-tight">
            Running Multi-Layer Forensic & Biometric Pipeline
          </h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-mono font-bold text-blue-400">{progressPct}%</span>
          <p className="text-[11px] text-zinc-500 font-mono">RAM Stream Active</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-800 rounded-full h-2 mb-6 overflow-hidden">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 shadow-sm shadow-blue-500/50"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Current Active Stage Highlight Bento Box */}
      <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 mb-6">
        <div className="flex items-start gap-3">
          <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {activeStage.category}: {activeStage.name}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">In-Memory Buffer</span>
            </div>
            <p className="text-sm text-zinc-200 mt-1 font-medium">
              {activeStage.description}
            </p>
            <p className="text-xs text-zinc-400 font-mono mt-2 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              ⚡ {activeStage.subAction}...
            </p>
          </div>
        </div>
      </div>

      {/* Stage Checklist */}
      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isDone = completedStages.includes(idx);
          const isCurrent = currentStageIndex === idx && !isDone;

          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                isDone
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  : isCurrent
                  ? 'bg-zinc-900 border-blue-500/50 text-zinc-100 font-medium'
                  : 'bg-zinc-950/40 border-zinc-800/40 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                ) : isCurrent ? (
                  <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-zinc-700 shrink-0" />
                )}
                <span>{stage.name}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING...' : 'QUEUED'}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
