import React from 'react';
import { Award, Lock, Users } from 'lucide-react';

interface NavbarProps {
  onOpenCompliance: () => void;
  onOpenAboutUs: () => void;
  totalScreeningsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCompliance,
  onOpenAboutUs
}) => {
  return (
    <header className="bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Version Tag */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-base shadow-sm shadow-blue-500/30">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
                  DocShield
                </h1>
                <span className="text-xs text-zinc-500 font-mono font-normal">v2.4.0</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 hidden sm:inline-block">
                  SIH26188
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden md:block">
                AI Identity & Document Screening System
              </p>
            </div>
          </div>

          {/* Telemetry & Bento Status Badges */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-zinc-400">System: Active</span>
            </div>
            <div className="bg-zinc-800/80 px-2.5 py-1 rounded text-zinc-300 font-mono text-[11px] border border-zinc-700/50 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-green-400" />
              <span>RAM_ONLY_MODE: ENABLED</span>
            </div>
            <div className="text-zinc-500 font-mono text-[11px]">
              ID: DS-99281-X
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2">
            <button
              id="btn-nav-about-us"
              onClick={onOpenAboutUs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer shadow-sm"
              title="About Team TechForge"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>About Us</span>
            </button>

            <button
              id="btn-compliance"
              onClick={onOpenCompliance}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all cursor-pointer shadow-sm"
              title="View UIDAI & NIST SP 800-63A Specifications"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Standards & Compliance</span>
              <span className="sm:hidden">Standards</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
