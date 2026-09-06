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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bento Banner */}
        <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Team TechForge
                </span>
                <span className="text-xs text-zinc-500 font-mono">SIH26188 Project Innovators</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 mt-1 tracking-tight">
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
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/60 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Banner Privacy Notice */}
        <div className="px-6 py-2.5 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-green-400" />
            <span>Privacy Filter: Mobile numbers and enrollment IDs are permanently censored.</span>
          </div>
          <span className="hidden md:inline text-zinc-500">6 Members • B.Tech Year 2 (Sem 3)</span>
        </div>

        {/* Content Body: Team Member Bento Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEAM_MEMBERS.map((member, idx) => {
              const isLeader = member.role === 'Team Leader';
              return (
                <div 
                  key={idx}
                  className={`rounded-xl border p-4.5 transition-all flex flex-col justify-between ${
                    isLeader 
                      ? 'bg-zinc-900/90 border-blue-500/40 shadow-sm shadow-blue-500/10' 
                      : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    {/* Role & Name */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                          {member.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 text-zinc-500" />
                          <span>CSE • Year {member.year} (Sem {member.semester})</span>
                        </p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border ${
                        isLeader 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {member.role}
                      </span>
                    </div>

                    {/* Meta Details Table */}
                    <div className="mt-3 space-y-2 text-xs">
                      {/* Enrollment ID (Censored) */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                          Enrollment No.
                        </span>
                        <span className="font-mono font-bold text-zinc-200">
                          {maskEnrl(member.enrlNo)}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          Email
                        </span>
                        <a 
                          href={`mailto:${member.email}`}
                          className="font-mono text-[11px] text-blue-400 hover:text-blue-300 truncate max-w-[200px]"
                          title={member.email}
                        >
                          {member.email}
                        </a>
                      </div>

                      {/* Mobile (Censored) */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-400" />
                          Mobile No.
                        </span>
                        <span className="font-mono font-semibold text-zinc-300">
                          {maskPhone(member.mobile)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gender & Status Badge */}
                  <div className="mt-3.5 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Gender: {member.gender}</span>
                    <span className="text-green-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Active Contributor
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Institution & Hackathon Footer Note */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Smart India Hackathon (SIH26188)</strong> • Developed by Team TechForge
              </span>
            </div>
            <span className="text-zinc-500 font-mono text-[11px]">
              Acropolis Institute of Technology and Research
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-end">
          <button
            id="btn-close-about-us-bottom"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
