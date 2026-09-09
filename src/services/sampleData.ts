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

// Exact representation of User Uploaded Fake Document: Cristiano Ronaldo Aadhaar Spoof
function createRonaldoSpoofSvg(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <rect width="600" height="380" rx="12" fill="#faf8f5" stroke="#cbd5e1" stroke-width="2"/>
    <g transform="translate(30, 25)">
      <circle cx="18" cy="18" r="16" fill="#1e3a8a" opacity="0.1"/>
      <path d="M18,6 L18,30 M10,14 L26,24 M10,24 L26,14" stroke="#1e3a8a" stroke-width="2"/>
      <text x="50" y="16" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#334155">भारत सरकार</text>
      <text x="50" y="32" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1e293b">GOVERNMENT OF INDIA</text>
    </g>
    <!-- Tricolor brush strip -->
    <rect x="220" y="28" width="350" height="12" rx="4" fill="#fb923c" opacity="0.8"/>
    
    <!-- Photo Box with Cristiano Ronaldo silhouette -->
    <rect x="30" y="90" width="135" height="165" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="97" cy="150" r="38" fill="#0284c7"/>
    <path d="M50,240 Q97,185 145,240 Z" fill="#0f172a"/>
    <text x="97" y="225" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">CRISTIANO RONALDO</text>

    <!-- Forgery text fields -->
    <g transform="translate(190, 100)" font-family="Arial, sans-serif">
      <text x="0" y="20" font-size="18" font-weight="bold" fill="#0f172a">Aadhaar <tspan fill="#ef4444">Fake!</tspan></text>
      <text x="0" y="52" font-size="17" font-weight="bold" fill="#0f172a">Cristiano Ronaldo</text>
      <text x="0" y="80" font-size="14" fill="#334155">Male</text>
      <text x="0" y="108" font-size="14" fill="#334155">Patna, Bihar, India</text>
    </g>

    <!-- Invalid Verhoeff Checksum: 9876 5432 1098 -->
    <rect x="180" y="235" width="380" height="42" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="370" y="263" font-family="'Courier New', monospace" font-size="24" font-weight="bold" fill="#b91c1c" text-anchor="middle" letter-spacing="3">
      9876 5432 1098
    </text>

    <!-- Footer -->
    <g transform="translate(30, 310)" font-family="Arial, sans-serif">
      <text x="0" y="30" font-size="18" font-weight="bold" fill="#0f172a">आपका आधार</text>
      <text x="240" y="22" font-size="14" font-weight="bold" fill="#0f172a">YOUR</text>
      <text x="230" y="38" font-size="14" font-weight="bold" fill="#0f172a">AADHAAR</text>
      <!-- Sun logo -->
      <circle cx="480" cy="20" r="18" fill="#e05307"/>
      <circle cx="480" cy="20" r="9" fill="#ffffff"/>
      <text x="455" y="46" font-size="10" font-weight="bold" fill="#e05307">AADHAAR</text>
    </g>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

// Representation of Celebrity Spoof / Typo / Checksum Failure: Elon Musk Aadhaar Spoof
function createElonMuskSpoofSvg(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
    <defs>
      <linearGradient id="muskBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#fff8f0"/>
      </linearGradient>
    </defs>
    <!-- Card Base -->
    <rect width="600" height="380" rx="14" fill="url(#muskBg)" stroke="#cbd5e1" stroke-width="2"/>
    
    <!-- Top Emblem and Corrupted Typo Header: "भारतन सरकार" -->
    <g transform="translate(35, 25)">
      <circle cx="18" cy="18" r="16" fill="#1e3a8a" opacity="0.12"/>
      <path d="M18,6 L18,30 M10,14 L26,24 M10,24 L26,14" stroke="#1e3a8a" stroke-width="2"/>
      <!-- Corrupted Header Typo -->
      <text x="45" y="16" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#b91c1c">भारतन सरकार</text>
      <text x="45" y="32" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#1e293b">GOVERNMENT OF INDIA</text>
    </g>

    <!-- Tricolor strip -->
    <rect x="230" y="26" width="335" height="10" rx="4" fill="#fb923c" opacity="0.85"/>
    
    <!-- Portrait Box: Elon Musk Portrait -->
    <rect x="35" y="85" width="135" height="165" rx="8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="102" cy="140" r="38" fill="#1e293b"/>
    <circle cx="102" cy="132" r="32" fill="#fed7aa"/>
    <path d="M72,125 Q102,85 132,125 Q115,105 88,105 Z" fill="#475569"/>
    <path d="M50,240 Q102,185 155,240 Z" fill="#0f172a"/>
    <text x="102" y="222" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">ELON MUSK</text>

    <!-- Spoof Demographics & Absurd Address -->
    <g transform="translate(195, 95)" font-family="Arial, sans-serif">
      <text x="0" y="22" font-size="19" font-weight="bold" fill="#0f172a">Elon Musk</text>
      <text x="0" y="48" font-size="14" fill="#334155">जन्म तिथि / DOB: 28/06/1971</text>
      <text x="0" y="70" font-size="14" fill="#334155">लिंग / Gender: Male</text>
      <text x="0" y="96" font-size="13" font-weight="bold" fill="#b91c1c">पता / Address: 789, Space Colony</text>
      <text x="0" y="115" font-size="12" fill="#64748b">Near Launchpad, Mars Province</text>
    </g>

    <!-- QR code simulation -->
    <g transform="translate(480, 110)">
      <rect width="80" height="80" rx="4" fill="#0f172a"/>
      <rect x="6" y="6" width="68" height="68" fill="#ffffff"/>
      <rect x="15" y="15" width="20" height="20" fill="#0f172a"/>
      <rect x="45" y="15" width="20" height="20" fill="#0f172a"/>
      <rect x="15" y="45" width="20" height="20" fill="#0f172a"/>
    </g>

    <!-- Invalid Verhoeff Checksum: 4567 8901 2345 -->
    <rect x="35" y="265" width="530" height="46" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
    <text x="300" y="297" font-family="'Courier New', monospace" font-size="25" font-weight="bold" fill="#b91c1c" text-anchor="middle" letter-spacing="3">
      4567 8901 2345
    </text>

    <!-- Slogan & UIDAI Logo -->
    <g transform="translate(35, 335)" font-family="Arial, sans-serif">
      <text x="0" y="20" font-size="14" font-weight="bold" fill="#ea580c">मेरा आधार, मेरी पहचान</text>
      <text x="440" y="20" font-size="11" font-weight="bold" fill="#64748b">UIDAI Mockup</text>
    </g>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

// Exact representation of User Uploaded Original Document: Pranay Goswami e-Aadhaar Letter
function createEaadhaarLetterSvg(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="480" height="780" viewBox="0 0 480 780">
    <rect width="480" height="780" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <!-- Top banner -->
    <rect x="10" y="10" width="460" height="85" fill="#ea580c"/>
    <g transform="translate(30, 20)">
      <circle cx="20" cy="20" r="16" fill="#ffffff" opacity="0.2"/>
      <text x="50" y="22" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#ffffff">भारत सरकार</text>
      <text x="50" y="42" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">Government of India</text>
    </g>
    <!-- UIDAI Green band -->
    <rect x="10" y="98" width="460" height="38" fill="#15803d"/>
    <text x="240" y="116" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">भारतीय विशिष्ट पहचान प्राधिकरण</text>
    <text x="240" y="130" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">Unique Identification Authority of India</text>

    <!-- Enrolment Details -->
    <g transform="translate(30, 155)" font-family="Arial, sans-serif">
      <text x="0" y="15" font-size="11" font-weight="bold" fill="#0f172a">नामांकन क्रम / Enrolment No.: 0515/28813/00666</text>
      <text x="0" y="40" font-size="10" fill="#64748b">To</text>
      <text x="0" y="58" font-size="12" font-weight="bold" fill="#0f172a">प्रणय गोस्वामी / Pranay Goswami</text>
      <text x="0" y="74" font-size="10" fill="#334155">S/O: Rajeshpuri Goswami</text>
      <text x="0" y="88" font-size="10" fill="#334155">ward no 15 ramnagar colony seoni malwa</text>
      <text x="0" y="102" font-size="10" fill="#334155">tehsil seoni malwa, Seoni-Malwa</text>
      <text x="0" y="116" font-size="10" fill="#334155">Hoshangabad Madhya Pradesh - 461223</text>
      <text x="0" y="130" font-size="10" font-weight="bold" fill="#0f172a">Mob: 9826969460</text>
    </g>

    <!-- Digital signature stamp placeholder with question mark -->
    <g transform="translate(60, 345)">
      <rect width="130" height="40" rx="4" fill="#fef9c3" stroke="#eab308" stroke-width="1"/>
      <circle cx="20" cy="20" r="10" fill="#eab308"/>
      <text x="17" y="24" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff">?</text>
      <text x="36" y="16" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#713f12">Signature Not Verified</text>
      <text x="36" y="26" font-family="Arial, sans-serif" font-size="6" fill="#854d0e">DS UIDAI 05 (2022.05.10)</text>
    </g>

    <!-- High-density QR code block -->
    <rect x="280" y="330" width="135" height="135" rx="6" fill="#0f172a"/>
    <rect x="290" y="340" width="115" height="115" fill="#ffffff"/>
    <circle cx="347" cy="397" r="18" fill="#0f172a"/>

    <!-- Mid Letter Aadhaar Number -->
    <g transform="translate(240, 500)" text-anchor="middle" font-family="Arial, sans-serif">
      <text x="0" y="0" font-size="11" fill="#475569">आपका आधार क्रमांक / Your Aadhaar No. :</text>
      <text x="0" y="28" font-family="'Courier New', monospace" font-size="22" font-weight="bold" fill="#0f172a" letter-spacing="3">6225 9242 6204</text>
      <text x="0" y="46" font-size="10" fill="#64748b">VID : 9177 2255 9420 2645</text>
      <text x="0" y="65" font-size="12" font-weight="bold" fill="#ea580c">मेरा आधार, मेरी पहचान</text>
    </g>

    <!-- Cut Line Marker with Scissor icon -->
    <line x1="10" y1="580" x2="470" y2="580" stroke="#94a3b8" stroke-dasharray="6 4" stroke-width="1.5"/>
    <text x="450" y="576" font-size="14">✂</text>

    <!-- Bottom Cut-out Physical Card -->
    <g transform="translate(20, 600)">
      <rect width="440" height="165" rx="8" fill="#fdfefe" stroke="#cbd5e1"/>
      <rect x="10" y="10" width="85" height="105" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
      <!-- Portrait silhouette -->
      <circle cx="52" cy="50" r="24" fill="#0369a1"/>
      <path d="M22,105 Q52,75 82,105 Z" fill="#0369a1"/>
      <text x="10" y="130" font-family="Arial, sans-serif" font-size="8" fill="#64748b">Issue: 25/01/2015</text>

      <!-- Demographic details -->
      <g transform="translate(110, 15)" font-family="Arial, sans-serif">
        <text x="0" y="15" font-size="13" font-weight="bold" fill="#0f172a">प्रणय गोस्वामी</text>
        <text x="0" y="32" font-size="12" font-weight="bold" fill="#0f172a">Pranay Goswami</text>
        <text x="0" y="50" font-size="10" fill="#475569">जन्म तिथि/DOB: 15/12/2006</text>
        <text x="0" y="66" font-size="10" fill="#475569">पुरुष/ MALE</text>
      </g>

      <!-- Bottom verified number -->
      <text x="220" y="125" font-family="'Courier New', monospace" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="2">6225 9242 6204</text>
      <text x="220" y="142" font-family="Arial, sans-serif" font-size="9" fill="#64748b" text-anchor="middle">VID : 9177 2255 9420 2645</text>
      <text x="220" y="156" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#ea580c" text-anchor="middle">मेरा आधार, मेरी पहचान</text>
    </g>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const SAMPLE_PRESETS: SampleDocumentPreset[] = [
  {
    id: 'user-fake-elon-musk',
    title: 'Aadhaar Meme/Spoof (Elon Musk - Fake Typo Card)',
    category: 'tampered',
    docType: 'aadhaar',
    description: 'Counterfeit Aadhaar spoof with celebrity photo (Elon Musk), typo header "भारतन सरकार", fictional address "789, Space Colony", and mathematically invalid Verhoeff checksum (4567 8901 2345).',
    expectedScore: 12,
    expectedRisk: 'high',
    docImage: createElonMuskSpoofSvg(),
    selfieImage: createSelfieSvg({ avatarColor: '#1e293b', isLivenessPassed: true }),
    mockData: {
      documentType: 'aadhaar',
      documentName: 'Fake_Aadhaar_Elon_Musk.png',
      authenticityScore: 12,
      riskLevel: 'high',
      decision: 'REJECT',
      recommendation: 'Immediate rejection. Counterfeit template: celebrity biometric spoof, misspelled government header (भारतन सरकार), absurd address (Space Colony), and failed Verhoeff checksum.'
    }
  },
  {
    id: 'user-original-eaadhaar',
    title: 'UIDAI e-Aadhaar Letter (Original)',
    category: 'genuine',
    docType: 'aadhaar',
    description: 'Authentic government e-Aadhaar sheet (Pranay Goswami). Valid Dihedral D5 Verhoeff checksum (6225 9242 6204), valid UIDAI digital signature stamp, and high-density 2D QR code.',
    expectedScore: 98,
    expectedRisk: 'low',
    docImage: createEaadhaarLetterSvg(),
    selfieImage: createSelfieSvg({ avatarColor: '#0369a1', isLivenessPassed: true }),
    mockData: {
      documentType: 'aadhaar',
      documentName: 'Original_eAadhaar_Pranay_Goswami.jpeg',
      authenticityScore: 98,
      riskLevel: 'low',
      decision: 'ACCEPT',
      recommendation: 'Authentic UIDAI e-Aadhaar letter verified. All security features, digital signatures, and mathematical Verhoeff checksum pass.'
    }
  },
  {
    id: 'user-fake-ronaldo',
    title: 'Aadhaar Meme/Spoof (Cristiano Ronaldo - Fake!)',
    category: 'tampered',
    docType: 'aadhaar',
    description: 'Fake Aadhaar card with explicit "Fake!" red title, Cristiano Ronaldo photo, and invalid mathematical Verhoeff checksum (9876 5432 1098).',
    expectedScore: 18,
    expectedRisk: 'high',
    docImage: createRonaldoSpoofSvg(),
    selfieImage: createSelfieSvg({ avatarColor: '#0284c7', isLivenessPassed: true }),
    mockData: {
      documentType: 'aadhaar',
      documentName: 'Fake_Aadhaar_Cristiano_Ronaldo.png',
      authenticityScore: 18,
      riskLevel: 'high',
      decision: 'REJECT',
      recommendation: 'Immediate rejection. Explicit fake document watermark, celebrity photo mismatch, and Verhoeff check digit failure.'
    }
  },
  {
    id: 'aadhaar-genuine',
    title: 'Aadhaar Card (Authentic)',
    category: 'genuine',
    docType: 'aadhaar',
    description: 'Genuine Aadhaar ID. Valid Verhoeff checksum (3675 9834 5017), no image tampering, authentic EXIF, matching live selfie.',
    expectedScore: 97,
    expectedRisk: 'low',
    docImage: createAadhaarSvg({
      name: 'AARAV SURESH SHARMA',
      dob: '14/08/1996',
      gender: 'MALE',
      aadhaarNum: '3675 9834 5017', // Mathematically Valid UIDAI Verhoeff Checksum!
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

export const SAMPLE_DOCUMENTS = SAMPLE_PRESETS;
