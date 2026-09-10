/**
 * DocShield - AI-Based Fake Identity & Document Screening System
 * Data Types & Schema Definitions
 */

export type DocumentType = 
  | 'aadhaar' 
  | 'pan' 
  | 'passport' 
  | 'voter_id' 
  | 'driving_license' 
  | 'unknown';

export type RiskLevel = 'low' | 'medium' | 'high';

export type DecisionType = 'ACCEPT' | 'MANUAL_REVIEW' | 'REJECT';

export interface BoundingBox {
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
  label?: string;
  confidence?: number;
}

export interface OcrField {
  id: string;
  name: string;
  label: string;
  value: string;
  confidence: number;
  expectedPattern?: string;
  isValid: boolean;
  validationMessage?: string;
  bbox?: BoundingBox;
}

export interface ForensicSignal {
  id: string;
  name: string;
  category: 'ela' | 'exif' | 'checksum' | 'biometric' | 'synthetic' | 'quality' | 'liveness';
  status: 'passed' | 'warning' | 'failed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  scoreImpact: number; // deduction from 100
  suspiciousRegions?: BoundingBox[];
  technicalDetails?: string;
}

export interface BiometricAnalysis {
  faceFoundInDoc: boolean;
  faceFoundInSelfie: boolean;
  matchScore: number;         // 0 - 100%
  similarityMetric: 'cosine' | 'euclidean';
  distanceValue: number;      // e.g. 0.22 (lower is closer)
  livenessPassed: boolean;
  livenessScore: number;      // 0 - 100%
  livenessIndicators: {
    eyeBlinkDetected: boolean;
    headPoseVariation: boolean;
    textureScreenMoiréScore: number;
    spoofProbability: number;
  };
  docFaceBbox?: BoundingBox;
  selfieFaceBbox?: BoundingBox;
}

export interface ImageQualityMetrics {
  resolutionWidth: number;
  resolutionHeight: number;
  blurScore: number;          // Laplacian variance
  isBlurry: boolean;
  glareDetected: boolean;
  contrastScore: number;
  deskewAngleDeg: number;
}

export interface ExifReport {
  hasExif: boolean;
  softwareDetected?: string;  // e.g., "Adobe Photoshop 2024", "Canva"
  isEditedSoftwareFlagged: boolean;
  cameraMake?: string;
  cameraModel?: string;
  modifyDate?: string;
  gpsLocated: boolean;
  tamperWarning: string | null;
}

export interface GovernmentGatewayVerification {
  authority: string;
  gatewayStatus: 'VERIFIED_ACTIVE' | 'RECORD_NOT_FOUND' | 'INTEGRITY_MISMATCH' | 'SUSPENDED';
  apiEndpoint: string;
  responseLatencyMs: number;
  digitalSignatureVerified: boolean;
  pkiCertificateIssuer: string;
  matchRecords: {
    identityStatus: 'ACTIVE_VALID' | 'INVALID_OR_NOT_FOUND';
    nameMatchPercentage: number;
    dobVerified: boolean;
    genderVerified: boolean;
    jurisdiction: string;
  };
  auditReferenceId: string;
}

export interface BlockchainVerification {
  network: 'Ethereum Mainnet' | 'Polygon PoS Identity Ledger' | 'GovChain India Hyperledger Fabric';
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  merkleRoot: string;
  merkleProofVerified: boolean;
  zeroKnowledgeProof: {
    scheme: 'zk-SNARK (Groth16)' | 'zk-STARK';
    circuit: string;
    isValid: boolean;
    publicInputsHash: string;
  };
  revocationStatus: 'ACTIVE_UNREVOKED' | 'REVOKED';
  documentDigestSha256: string;
  timestamp: string;
}

export interface ScreeningReport {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  documentName: string;
  documentImageUrl: string;
  selfieImageUrl: string;
  elaHeatmapUrl: string;
  
  // High-level scores
  authenticityScore: number;  // 0 - 100 (100 = authentic)
  riskLevel: RiskLevel;
  decision: DecisionType;
  recommendation: string;
  reasons?: string[];

  // Breakdown sub-scores (0-100)
  subScores: {
    structural: number;
    forensics: number;
    biometrics: number;
    metadata: number;
  };

  quality: ImageQualityMetrics;
  ocrFields: OcrField[];
  forensicSignals: ForensicSignal[];
  biometrics: BiometricAnalysis;
  exif: ExifReport;

  // Live Government Gateway & Blockchain Cybersecurity Ledger
  governmentGateway?: GovernmentGatewayVerification;
  blockchain?: BlockchainVerification;

  // Compliance checks
  compliance: {
    uidaiVerhoeffValid?: boolean;
    nistIdentityAssuranceLevel: 'IAL1' | 'IAL2' | 'IAL3';
    icaoMrzValid?: boolean;
    ramOnlyPrivacyEnforced: boolean;
  };

  processingTimeMs: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  authenticityScore: number;
  riskLevel: RiskLevel;
  decision: DecisionType;
  failedSignalsCount: number;
  flagSummaries: string[];
  executionTimeMs: number;
  storageMode: 'RAM_ONLY_NO_PERSISTENCE';
}
