import React from 'react';
import { X, Award, Shield, CheckCircle2, Lock, BookOpen } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF9500]/15 border border-[#FF9500]/25 flex items-center justify-center text-[#FF9500]">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Compliance & Reference Standards</h3>
              <p className="text-xs text-zinc-400">Smart India Hackathon SIH26188 Architectural Specs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4 text-xs text-zinc-300 leading-relaxed">
          
          {/* Section 1: UIDAI */}
          <div className="p-4.5 rounded-2xl bg-[#2c2c2e]/60 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-[#FF9500]">
              <Shield className="w-4 h-4 stroke-[2.2]" />
              <span>UIDAI Aadhaar Authentication Guidelines</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-zinc-300">
              <li>
                <strong>Verhoeff Checksum Algorithm:</strong> Dihedral group $D_5$ checksum computation (ISO/IEC 7064, Mod 11, 10). Detects all single-digit errors and 100% of adjacent transposition errors in the 12-digit UID.
              </li>
              <li>
                <strong>Face Authentication Directives:</strong> Prescribes 1:1 facial biometric matching with presentation attack detection (PAD) to stop static photographs and screen replay attacks.
              </li>
              <li>
                <strong>Data Minimization:</strong> Storage of raw Aadhaar images by non-AUA/KUA entities is strictly prohibited; ephemeral in-memory processing satisfies Section 29 of the Aadhaar Act.
              </li>
            </ul>
          </div>

          {/* Section 2: NIST SP 800-63A */}
          <div className="p-4.5 rounded-2xl bg-[#2c2c2e]/60 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-[#007AFF]">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
              <span>NIST SP 800-63A / 63-4 (Digital Identity Guidelines)</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-zinc-300">
              <li>
                <strong>Identity Assurance Level (IAL2):</strong> Requires remote biometric comparison of the applicant against the physical credential photo with a 1:1 face match.
              </li>
              <li>
                <strong>Physical Security & Alteration Check:</strong> Requires verification of holographic emblems, microprint integrity, and digital tamper inspection (Error Level Analysis).
              </li>
              <li>
                <strong>Biometric Liveness:</strong> Conforms to ISO/IEC 30107-3 presentation attack detection standards.
              </li>
            </ul>
          </div>

          {/* Section 3: ICAO Doc 9303 */}
          <div className="p-4.5 rounded-2xl bg-[#2c2c2e]/60 border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold text-[#34C759]">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              <span>ICAO Doc 9303 (Machine Readable Travel Documents)</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-zinc-300">
              <li>
                <strong>MRZ Checksum Calculations:</strong> 7-3-1 weight algorithm for passport serial numbers, date of birth, expiration date, and composite checksum.
              </li>
              <li>
                <strong>Optical Character Recognition (OCR-B):</strong> Font metric standards for automated border control systems.
              </li>
            </ul>
          </div>

          {/* Section 4: Privacy Architecture */}
          <div className="p-4.5 rounded-2xl bg-[#34C759]/10 border border-[#34C759]/25">
            <div className="flex items-center gap-2 mb-1 text-sm font-bold text-[#34C759]">
              <Lock className="w-4 h-4 stroke-[2.2]" />
              <span>Zero Persistent Storage Architecture Guarantee</span>
            </div>
            <p className="text-zinc-300 text-xs">
              All documents are passed strictly through volatile memory streams (<code className="font-mono text-[#34C759]">io.BytesIO</code>). 
              No file is ever written to disk or long-term databases. Memory references are destroyed immediately after risk computation. 
              Only an anonymous audit log containing risk scores and timestamps is recorded for compliance.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-[#0066d6] text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
          >
            Close & Return
          </button>
        </div>

      </div>
    </div>
  );
};
