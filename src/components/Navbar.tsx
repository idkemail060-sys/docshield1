import React from 'react';
import { Award, Lock, ShieldCheck, Users, Link2 } from 'lucide-react';

interface NavbarProps {
  onOpenCompliance: () => void;
  onOpenAboutUs: () => void;
  onOpenBlockchainSecurity: () => void;
  totalScreeningsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCompliance,
  onOpenAboutUs,
  onOpenBlockchainSecurity
}) => {
  return (
    <header className="bg-[#000000]/80 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Version Tag (iOS App Icon squircle) */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-b from-[#007AFF] to-[#0055b8] rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
                  DocShield
                </h1>
                <span className="text-[11px] text-zinc-400 font-mono font-normal">v2.4.0</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1c1c1e] text-zinc-400 border border-white/[0.08] hidden sm:inline-block">
                  SIH26188
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden md:block">
                Blockchain & Cybersecurity Document Verification
              </p>
            </div>
          </div>

          {/* Telemetry & Bento Status Badges (iOS Status Pills) */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1e]/80 border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
              <span className="text-zinc-300 font-medium">Node: Polygon Active</span>
            </div>
            <div className="bg-[#1c1c1e]/80 px-3 py-1 rounded-full text-zinc-300 font-mono text-[11px] border border-white/[0.06] flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#34C759]" />
              <span>RAM_ONLY_ZERO_DISK</span>
            </div>
            <div className="text-zinc-400 font-mono text-[11px] px-2.5 py-1">
              ID: DS-99281-X
            </div>
          </div>

          {/* Navigation Controls (iOS Action Pills) */}
          <nav className="flex items-center gap-2">
            <button
              id="btn-blockchain-security"
              onClick={onOpenBlockchainSecurity}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#007AFF]/20 hover:bg-[#007AFF]/30 border border-[#007AFF]/40 transition-all cursor-pointer shadow-sm active:scale-95"
              title="View Blockchain & Cybersecurity Theme Specification, Smart Contract & zk-SNARK proof"
            >
              <Link2 className="w-3.5 h-3.5 text-[#007AFF]" />
              <span className="hidden sm:inline">Blockchain & Cybersecurity</span>
              <span className="sm:hidden">Blockchain</span>
            </button>

            <button
              id="btn-nav-about-us"
              onClick={onOpenAboutUs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-200 hover:text-white bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/[0.08] transition-all cursor-pointer shadow-sm active:scale-95"
              title="About Team TechForge"
            >
              <Users className="w-3.5 h-3.5 text-[#007AFF]" />
              <span className="hidden md:inline">About Us</span>
            </button>

            <button
              id="btn-compliance"
              onClick={onOpenCompliance}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-200 hover:text-white bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-white/[0.08] transition-all cursor-pointer shadow-sm active:scale-95"
              title="View UIDAI & NIST SP 800-63A Specifications"
            >
              <Award className="w-3.5 h-3.5 text-[#FF9500]" />
              <span className="hidden md:inline">Standards</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
