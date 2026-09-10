import React from 'react';
import { 
  X, 
  Users, 
  Award, 
  GraduationCap, 
  Mail, 
  Phone, 
  Lock,
  Sparkles,
  Building2
} from 'lucide-react';

interface TeamMember {
  role: 'Team Leader' | 'Team Member';
  name: string;
  enrlNo: string;
  dept: string;
  year: number;
  semester: number;
  gender: 'Male' | 'Female';
  email: string;
  mobile: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    role: 'Team Leader',
    name: 'Pranay Goswami',
    enrlNo: '0827CS251198',
    dept: 'Computer Science & Engineering (CSE)',
    year: 2,
    semester: 3,
    gender: 'Male',
    email: 'pranaygoswami250734@acropolis.in',
    mobile: '6264126677'
  },
  {
    role: 'Team Member',
    name: 'Ojas Singh Sisodiya',
    enrlNo: '0827CS251182',
    dept: 'Computer Science & Engineering (CSE)',
    year: 2,
    semester: 3,
    gender: 'Male',
    email: 'ojassisodiya251487@acropolis.in',
    mobile: '9826666497'
  },
  {
    role: 'Team Member',
    name: 'Pali Bisen',
    enrlNo: '0827CS251185',
    dept: 'Computer Science & Engineering (CSE)',
    year: 2,
    semester: 3,
    gender: 'Female',
    email: 'palibisen250280@acropolis.in',
    mobile: '7999760602'
  },
  {
    role: 'Team Member',
    name: 'Nitya Jain',
    enrlNo: '0827CS251181',
    dept: 'Computer Science & Engineering (CSE)',
    year: 2,
    semester: 3,
    gender: 'Female',
    email: 'nityajain250316@acropolis.in',
    mobile: '9201427948'
  },
  {
    role: 'Team Member',
    name: 'Anshika Rahangdale',
    enrlNo: '0827CS251035',
    dept: 'Computer Science & Engineering (CSE)',
    year: 2,
    semester: 3,
    gender: 'Female',
    email: 'anshikarahangdale250277@acropolis.in',
    mobile: '7748018370'
  },
  {
    role: 'Team Member',
    name: 'Purva Bisen',
    enrlNo: '0827CS251212',
    dept: 'Computer Science & Engineering (CSE)',
    year: 2,
    semester: 3,
    gender: 'Female',
    email: 'purvabisen250393@acropolis.in',
    mobile: '6260010296'
  }
];

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Masking helpers - permanently censored
  const maskPhone = (phone: string) => {
    return `${phone.slice(0, 3)}•••••••`;
  };

  const maskEnrl = (enrl: string) => {
    return `${enrl.slice(0, 6)}••••••`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#1c1c1e]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bento Banner */}
        <div className="p-6 bg-[#2c2c2e]/60 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#007AFF]/15 border border-[#007AFF]/25 flex items-center justify-center text-[#007AFF] font-bold shrink-0">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-medium bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/25 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#007AFF]" />
                  Team TechForge
                </span>
                <span className="text-xs text-zinc-400 font-mono">SIH26188 Project Innovators</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
                About Team TechForge
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Acropolis Institute of Technology and Research • Department of Computer Science & Engineering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              id="btn-close-about-us"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Banner Privacy Notice */}
        <div className="px-6 py-2.5 bg-[#2c2c2e]/30 border-b border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#34C759]" />
            <span>Privacy Filter: Mobile numbers and enrollment IDs are permanently censored.</span>
          </div>
          <span className="hidden md:inline text-zinc-400">6 Members • B.Tech Year 2 (Sem 3)</span>
        </div>

        {/* Content Body: Team Member Bento Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEAM_MEMBERS.map((member, idx) => {
              const isLeader = member.role === 'Team Leader';
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border p-4.5 transition-all flex flex-col justify-between ${
                    isLeader 
                      ? 'bg-[#2c2c2e]/80 border-[#007AFF]/40 shadow-lg shadow-blue-500/10' 
                      : 'bg-[#2c2c2e]/50 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div>
                    {/* Role & Name */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {member.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-zinc-500" />
                          <span>CSE • Year {member.year} (Sem {member.semester})</span>
                        </p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
                        isLeader 
                          ? 'bg-[#007AFF]/15 text-[#007AFF] border-[#007AFF]/30' 
                          : 'bg-[#1c1c1e] text-zinc-400 border-white/[0.06]'
                      }`}>
                        {member.role}
                      </span>
                    </div>

                    {/* Meta Details Table */}
                    <div className="mt-3 space-y-2 text-xs">
                      {/* Enrollment ID (Censored) */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c1c1e] border border-white/[0.06]">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                          Enrollment No.
                        </span>
                        <span className="font-mono font-bold text-zinc-200">
                          {maskEnrl(member.enrlNo)}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c1c1e] border border-white/[0.06]">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" />
                          Email
                        </span>
                        <a 
                          href={`mailto:${member.email}`}
                          className="font-mono text-[11px] text-[#007AFF] hover:text-[#409cff] truncate max-w-[200px]"
                          title={member.email}
                        >
                          {member.email}
                        </a>
                      </div>

                      {/* Mobile (Censored) */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[#1c1c1e] border border-white/[0.06]">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          Mobile No.
                        </span>
                        <span className="font-mono font-semibold text-zinc-300">
                          {maskPhone(member.mobile)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gender & Status Badge */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Gender: {member.gender}</span>
                    <span className="text-[#34C759] flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
                      Active Contributor
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institution & Hackathon Footer Note */}
          <div className="p-4.5 rounded-2xl bg-[#2c2c2e]/60 border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF9500] shrink-0 stroke-[2.2]" />
              <span>
                <strong>Smart India Hackathon (SIH26188)</strong> • Developed by Team TechForge
              </span>
            </div>
            <span className="text-zinc-400 font-mono text-[11px]">
              Acropolis Institute of Technology and Research
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#2c2c2e]/60 border-t border-white/[0.08] flex items-center justify-end">
          <button
            id="btn-close-about-us-bottom"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-[#0066d6] text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
