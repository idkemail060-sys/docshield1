/**
 * DocShield - Realistic Sample Presets for Instant SIH Testing & Demonstrations
 * Pre-configured test vectors covering genuine, forged, tampered, and synthetic documents.
 */

import { SampleDocumentPreset } from '../types';

// Helper to generate SVG Data URI with realistic document card rendering
function createAadhaarSvg(options: {
  name: string;
  dob: string;
  gender: string;
  aadhaarNum: string;
  isTampered?: boolean;
  tamperText?: string;
  avatarColor?: string;
}): string {
  const { name, dob, gender, aadhaarNum, isTampered, avatarColor = '#1e3a8a' } = options;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#fffdf7"/>
        <stop offset="100%" stop-color="#fdf4e2"/>
      </linearGradient>
      <linearGradient id="header" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#e05307"/>
        <stop offset="48%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#138808"/>
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
      </filter>
    </defs>
    
    <!-- Base Card -->
    <rect x="10" y="10" width="580" height="360" rx="16" fill="url(#bg)" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow)"/>
    
    <!-- Top Tricolor Ribbon -->
    <rect x="12" y="12" width="576" height="8" rx="4" fill="url(#header)"/>
    
    <!-- Header Banner -->
    <g transform="translate(30, 36)">
      <!-- Ashoka Emblem Placeholder -->
      <circle cx="20" cy="20" r="16" fill="#1e3a8a" opacity="0.1"/>
      <path d="M20,6 L20,34 M10,14 L30,26 M10,26 L30,14" stroke="#1e3a8a" stroke-width="1.5"/>
      <text x="50" y="18" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e293b">GOVERNMENT OF INDIA</text>
      <text x="50" y="32" font-family="Arial, sans-serif" font-size="11" fill="#64748b">Unique Identification Authority of India</text>
    </g>

    <!-- Aadhaar Logo (Stylized Sun) -->
    <g transform="translate(500, 32)">
      <circle cx="22" cy="22" r="12" fill="#e05307"/>
      <circle cx="22" cy="22" r="6" fill="#ffffff"/>
      <text x="-4" y="38" font-family="sans-serif" font-size="9" font-weight="bold" fill="#e05307">आधार</text>
    </g>

    <!-- Divider -->
    <line x1="30" y1="84" x2="570" y2="84" stroke="#e2e8f0" stroke-width="1.5"/>

    <!-- Document Photo Box -->
    <g transform="translate(40, 105)">
      <rect x="0" y="0" width="115" height="145" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Stylized Face Avatar -->
      <circle cx="57" cy="55" r="32" fill="${avatarColor}"/>
      <path d="M20,135 Q57,85 94,135 Z" fill="${avatarColor}"/>
      <!-- Photo Border watermark -->
      <rect x="2" y="2" width="111" height="141" rx="6" fill="none" stroke="#64748b" stroke-dasharray="4 2" opacity="0.5"/>
    </g>

    <!-- Demographic Details -->
    <g transform="translate(180, 115)" font-family="Arial, sans-serif">
      <text x="0" y="20" font-size="16" font-weight="bold" fill="#0f172a">${name}</text>
      
      <text x="0" y="55" font-size="13" fill="#475569">DOB: </text>
      <text x="45" y="55" font-size="13" font-weight="600" fill="${isTampered ? '#dc2626' : '#0f172a'}">${dob}</text>
      ${isTampered ? '<rect x="42" y="40" width="105" height="22" fill="#fee2e2" stroke="#ef4444" stroke-width="1" stroke-dasharray="3 2" rx="4" opacity="0.8"/>' : ''}

      <text x="0" y="85" font-size="13" fill="#475569">Gender / लिंग: </text>
      <text x="100" y="85" font-size="13" font-weight="600" fill="#0f172a">${gender}</text>
      
      <text x="0" y="115" font-size="11" fill="#64748b">Address: 42/B, MG Road, Koramangala, Bengaluru, Karnataka</text>
    </g>

    <!-- Stylized QR Code Placeholder -->
    <g transform="translate(470, 140)">
      <rect x="0" y="0" width="85" height="85" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
      <!-- QR Blocks -->
      <rect x="8" y="8" width="22" height="22" fill="#0f172a"/>
      <rect x="12" y="12" width="14" height="14" fill="#ffffff"/>
      <rect x="55" y="8" width="22" height="22" fill="#0f172a"/>
      <rect x="59" y="12" width="14" height="14" fill="#ffffff"/>
      <rect x="8" y="55" width="22" height="22" fill="#0f172a"/>
      <rect x="12" y="59" width="14" height="14" fill="#ffffff"/>
      <rect x="36" y="36" width="12" height="12" fill="#0f172a"/>
      <rect x="52" y="52" width="15" height="15" fill="#0f172a"/>
    </g>

    <!-- Bottom Aadhaar 12-Digit Number -->
    <g transform="translate(30, 290)">
      <rect x="0" y="0" width="540" height="56" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="270" y="36" text-anchor="middle" font-family="'Courier New', monospace" font-size="22" font-weight="bold" letter-spacing="4" fill="${isTampered ? '#b91c1c' : '#0f172a'}">
        ${aadhaarNum}
      </text>
    </g>
    
    <!-- Footer Tagline -->
    <text x="300" y="362" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">
      आधार - आम आदमी का अधिकार (My Aadhaar, My Identity)
    </text>
  </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

function createPanSvg(options: {
  name: string;
  fatherName: string;
  dob: string;
  panNum: string;
  isInvalid?: boolean;
}): string {
  const { name, fatherName, dob, panNum, isInvalid } = options;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <defs>
      <linearGradient id="panBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0f2fe"/>
        <stop offset="50%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#7dd3fc"/>
      </linearGradient>
    </defs>
    <rect x="10" y="10" width="580" height="360" rx="16" fill="url(#panBg)" stroke="#38bdf8" stroke-width="2"/>
    
    <!-- Header -->
    <text x="300" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0369a1">INCOME TAX DEPARTMENT</text>
    <text x="300" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#0c4a6e">GOVT. OF INDIA</text>
    <line x1="30" y1="78" x2="570" y2="78" stroke="#38bdf8" stroke-width="1"/>

    <!-- Photo box -->
    <rect x="40" y="100" width="110" height="140" rx="6" fill="#f8fafc" stroke="#64748b"/>
    <circle cx="95" cy="150" r="30" fill="#0369a1"/>
    <path d="M60,230 Q95,185 130,230 Z" fill="#0369a1"/>

    <!-- PAN Fields -->
    <g transform="translate(175, 105)" font-family="Arial, sans-serif">
      <text x="0" y="15" font-size="10" fill="#475569">Permanent Account Number</text>
      <text x="0" y="40" font-family="'Courier New', monospace" font-size="20" font-weight="bold" fill="${isInvalid ? '#dc2626' : '#0f172a'}">${panNum}</text>
      ${isInvalid ? '<rect x="-4" y="20" width="170" height="26" fill="#fee2e2" stroke="#dc2626" rx="4" opacity="0.6"/>' : ''}

      <text x="0" y="70" font-size="10" fill="#475569">Name</text>
      <text x="0" y="90" font-size="14" font-weight="bold" fill="#0f172a">${name}</text>

      <text x="0" y="115" font-size="10" fill="#475569">Father's Name</text>
      <text x="0" y="132" font-size="13" font-weight="600" fill="#0f172a">${fatherName}</text>

      <text x="0" y="155" font-size="10" fill="#475569">Date of Birth</text>
      <text x="0" y="172" font-size="13" font-weight="600" fill="#0f172a">${dob}</text>
    </g>

    <!-- QR/Hologram -->
    <rect x="460" y="100" width="95" height="95" rx="8" fill="#e2e8f0" stroke="#94a3b8"/>
    <circle cx="507" cy="147" r="25" fill="#f59e0b" opacity="0.7"/>
    <text x="507" y="152" text-anchor="middle" font-size="10" font-weight="bold" fill="#78350f">HOLOGRAM</text>

    <!-- Signature -->
    <rect x="40" y="270" width="180" height="50" rx="4" fill="#ffffff" stroke="#cbd5e1"/>
    <path d="M50,305 Q80,280 120,300 T180,290 T200,310" fill="none" stroke="#1e293b" stroke-width="2"/>
    <text x="40" y="335" font-size="10" fill="#475569">Signature / हस्ताक्षर</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

function createSelfieSvg(options: {
  avatarColor: string;
  hasGlasses?: boolean;
  isLivenessPassed?: boolean;
}): string {
  const { avatarColor, isLivenessPassed = true } = options;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="340" viewBox="0 0 300 340">
    <defs>
      <radialGradient id="selfieBg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </radialGradient>
    </defs>
    <rect width="300" height="340" rx="16" fill="url(#selfieBg)"/>
    
    <!-- Face Head -->
    <circle cx="150" cy="130" r="70" fill="${avatarColor}"/>
    <!-- Shoulders -->
    <path d="M40,320 Q150,220 260,320 Z" fill="${avatarColor}"/>
    
    <!-- Eyes -->
    <circle cx="125" cy="120" r="7" fill="#ffffff"/>
    <circle cx="125" cy="120" r="3.5" fill="#0f172a"/>
    <circle cx="175" cy="120" r="7" fill="#ffffff"/>
    <circle cx="175" cy="120" r="3.5" fill="#0f172a"/>
    
    <!-- Smile -->
    <path d="M135,160 Q150,175 165,160" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>

    <!-- Live Badge -->
    <g transform="translate(15, 15)">
      <rect width="90" height="24" rx="12" fill="${isLivenessPassed ? '#22c55e' : '#f59e0b'}" opacity="0.9"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
      <text x="24" y="16" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">
        ${isLivenessPassed ? 'LIVE CAM' : 'STILL IMG'}
      </text>
    </g>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_PRESETS: SampleDocumentPreset[] = [
  {
    id: 'aadhaar-genuine',
    title: 'Aadhaar Card (Authentic)',
    category: 'genuine',
    docType: 'aadhaar',
    description: 'Genuine Aadhaar ID. Valid Verhoeff checksum (3675 9834 5012), no image tampering, authentic EXIF, matching live selfie.',
    expectedScore: 97,
    expectedRisk: 'low',
    docImage: createAadhaarSvg({
      name: 'AARAV SURESH SHARMA',
      dob: '14/08/1996',
      gender: 'MALE',
      aadhaarNum: '3675 9834 5012', // Valid Verhoeff!
      avatarColor: '#1e3a8a'
    }),
    selfieImage: createSelfieSvg({ avatarColor: '#1e3a8a', isLivenessPassed: true }),
    mockData: {
      documentType: 'aadhaar',
      documentName: 'Aadhaar_Aarav_Sharma.jpg',
      authenticityScore: 97,
      riskLevel: 'low',
      decision: 'ACCEPT',
      recommendation: 'Document and biometric checks passed all tests. Fast-track onboarding approved (NIST IAL2 compliant).'
    }
  },
  {
    id: 'aadhaar-tampered-forgery',
    title: 'Aadhaar Card (Tampered DOB & Font)',
    category: 'tampered',
    docType: 'aadhaar',
    description: 'Forged document with digital DOB manipulation (cloned font glyphs), invalid Verhoeff checksum, and Photoshop EXIF metadata tag.',
    expectedScore: 24,
    expectedRisk: 'high',
    docImage: createAadhaarSvg({
      name: 'AARAV SURESH SHARMA',
      dob: '14/08/2004', // Tampered date
      gender: 'MALE',
      aadhaarNum: '3675 9834 5018', // INVALID Verhoeff checksum
      isTampered: true,
      avatarColor: '#1e3a8a'
    }),
    selfieImage: createSelfieSvg({ avatarColor: '#1e3a8a', isLivenessPassed: true }),
    mockData: {
      documentType: 'aadhaar',
      documentName: 'Aadhaar_Altered_DOB.jpg',
      authenticityScore: 24,
      riskLevel: 'high',
      decision: 'REJECT',
      recommendation: 'Reject document. Significant Error Level Analysis (ELA) anomalies detected in the Date of Birth region; Verhoeff D8 algorithm failed.'
    }
  },
  {
    id: 'pan-invalid-checksum',
    title: 'PAN Card (Invalid Format & Mismatch)',
    category: 'invalid_checksum',
    docType: 'pan',
    description: 'Invalid PAN structure (4th char entity type mismatch), OCR font anomaly, and face biometric divergence against live selfie.',
    expectedScore: 36,
    expectedRisk: 'high',
    docImage: createPanSvg({
      name: 'RAJESH KUMAR VERMA',
      fatherName: 'MAHESH VERMA',
      dob: '02/11/1988',
      panNum: 'ABCX99872Z', // Invalid PAN 4th char X
      isInvalid: true
    }),
    selfieImage: createSelfieSvg({ avatarColor: '#b45309', isLivenessPassed: true }), // Different person color!
    mockData: {
      documentType: 'pan',
      documentName: 'PAN_Card_Invalid_Entity.jpg',
      authenticityScore: 36,
      riskLevel: 'high',
      decision: 'REJECT',
      recommendation: 'Reject document. PAN 4th entity character is invalid; biometric facial distance indicates a different person.'
    }
  },
  {
    id: 'passport-synthetic-review',
    title: 'Passport (Synthetic Noise / Review)',
    category: 'synthetic',
    docType: 'passport',
    description: 'Passport photo with AI/GAN-generated frequency artifacts and borderline facial similarity requiring human verification.',
    expectedScore: 61,
    expectedRisk: 'medium',
    docImage: createAadhaarSvg({
      name: 'PRIYA MEHRA',
      dob: '23/05/1999',
      gender: 'FEMALE',
      aadhaarNum: '5124 8839 2101',
      avatarColor: '#7c3aed'
    }),
    selfieImage: createSelfieSvg({ avatarColor: '#7c3aed', isLivenessPassed: false }),
    mockData: {
      documentType: 'passport',
      documentName: 'Passport_Scan_Priya.pdf',
      authenticityScore: 61,
      riskLevel: 'medium',
      decision: 'MANUAL_REVIEW',
      recommendation: 'Route to Level-2 manual KYC compliance officer. Synthetic GAN spectral patterns detected in photo portrait.'
    }
  }
];
