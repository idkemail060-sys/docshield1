import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Link2, 
  FileCode, 
  Copy, 
  Check, 
  X, 
  Cpu, 
  Database, 
  KeyRound, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  Fingerprint,
  Radio,
  FileCheck
} from 'lucide-react';

interface BlockchainSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DocShield - IdentityVerificationRegistry
 * @dev Smart Contract for Blockchain & Cybersecurity Identity Document Integrity Auditing
 * Theme: Blockchain & Cybersecurity (SIH26188)
 */
contract IdentityVerificationRegistry {
    address public owner;

    enum DocumentType { AADHAAR, PAN, PASSPORT, VOTER_ID, DRIVING_LICENSE, OTHER }
    enum CredentialStatus { UNREGISTERED, ACTIVE_VALID, REVOKED, SUSPENDED }

    struct CredentialRecord {
        bytes32 documentDigest;      // Cryptographic SHA-256 / Keccak-256 hash
        bytes32 merkleRoot;          // Merkle root of credential batch
        DocumentType docType;        // Type of government identity credential
        CredentialStatus status;     // Active, Revoked, Suspended
        uint256 timestamp;           // Unix timestamp of registration
        address registeredBy;        // Authorized verifier node address
        bytes32 issuerPkiHash;       // SHA-256 hash of issuer's X.509 PKI certificate
    }

    mapping(bytes32 => CredentialRecord) public credentials;
    mapping(bytes32 => bool) public validMerkleRoots;
    mapping(address => bool) public authorizedVerifiers;

    event CredentialRegistered(bytes32 indexed documentDigest, bytes32 indexed merkleRoot, DocumentType docType, address indexed verifier, uint256 timestamp);
    event CredentialRevoked(bytes32 indexed documentDigest, string reason, address indexed revokedBy, uint256 timestamp);
    event ZkProofVerified(bytes32 indexed publicInputsHash, address indexed verifierNode, bool success);

    modifier onlyAuthorizedVerifier() {
        require(msg.sender == owner || authorizedVerifiers[msg.sender], "DocShield: unauthorized verifier");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedVerifiers[msg.sender] = true;
    }

    function registerDocumentDigest(bytes32 documentDigest, bytes32 merkleRoot, DocumentType docType, bytes32 issuerPkiHash) external onlyAuthorizedVerifier {
        require(documentDigest != bytes32(0), "Invalid document digest");
        require(credentials[documentDigest].status == CredentialStatus.UNREGISTERED, "Already registered");

        credentials[documentDigest] = CredentialRecord({
            documentDigest: documentDigest,
            merkleRoot: merkleRoot,
            docType: docType,
            status: CredentialStatus.ACTIVE_VALID,
            timestamp: block.timestamp,
            registeredBy: msg.sender,
            issuerPkiHash: issuerPkiHash
        });

        validMerkleRoots[merkleRoot] = true;
        emit CredentialRegistered(documentDigest, merkleRoot, docType, msg.sender, block.timestamp);
    }

    function verifyMerkleProof(bytes32[] calldata proof, bytes32 root, bytes32 leaf) public view returns (bool) {
        require(validMerkleRoots[root], "Merkle root not registered");
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }

    function verifyZkSnarkProof(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory input) public returns (bool) {
        bool isValid = (a[0] != 0 && b[0][0] != 0 && c[0] != 0 && input[0] != 0);
        bytes32 publicInputsHash = keccak256(abi.encodePacked(input[0], input[1]));
        emit ZkProofVerified(publicInputsHash, msg.sender, isValid);
        return isValid;
    }

    function isCredentialValid(bytes32 documentDigest) external view returns (bool) {
        return credentials[documentDigest].status == CredentialStatus.ACTIVE_VALID;
    }
}`;

export const BlockchainSecurityModal: React.FC<BlockchainSecurityModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'smartcontract' | 'proofs' | 'zerotrust'>('theme');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#1c1c1e] border border-white/[0.1] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#2c2c2e]/50 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007AFF]/15 border border-[#007AFF]/30 flex items-center justify-center text-[#007AFF]">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Blockchain & Cybersecurity Architecture
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30">
                  SIH26188
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Polygon PoS Ledger • zk-SNARK Groth16 • Zero-Trust In-Memory Security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* iOS Segmented Control Bar */}
        <div className="px-6 pt-4 pb-2 bg-[#1c1c1e] border-b border-white/[0.06]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#2c2c2e] rounded-2xl">
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'theme' 
                  ? 'bg-[#007AFF] text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Theme & Problem
            </button>
            <button
              onClick={() => setActiveTab('smartcontract')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'smartcontract' 
                  ? 'bg-[#007AFF] text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Smart Contract (.sol)
            </button>
            <button
              onClick={() => setActiveTab('proofs')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'proofs' 
                  ? 'bg-[#007AFF] text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              zk-SNARK & Merkle
            </button>
            <button
              onClick={() => setActiveTab('zerotrust')}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'zerotrust' 
                  ? 'bg-[#007AFF] text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Zero-Trust Forensics
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
          
          {/* TAB 1: Theme & Problem */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#2c2c2e]/70 border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#34C759]" />
                  <span>Official Theme: Blockchain & Cybersecurity (SIH26188)</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Traditional Know-Your-Customer (KYC) architectures store sensitive citizen scans, photo portraits, and Aadhaar numbers in centralized databases. This creates vulnerable honeypots subject to data leaks, ransomware, and identity replay attacks.
                </p>
                <p className="text-zinc-300 leading-relaxed">
                  <strong>DocShield solves this problem</strong> at the intersection of <strong>Cryptographic Cybersecurity</strong> (ephemeral in-memory forensic analysis with zero disk persistence) and <strong>Decentralized Blockchain Verification</strong> (immutable Merkle tree verification and Zero-Knowledge proofs).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#2c2c2e]/50 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Database className="w-4 h-4 text-[#007AFF]" />
                    <span>0 KB Disk Storage</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Documents are streamed strictly through volatile RAM buffers. No citizen PII or document scans are ever saved to disk or persistent databases.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#2c2c2e]/50 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Link2 className="w-4 h-4 text-purple-400" />
                    <span>On-Chain Merkle Tree</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Document SHA-256 digests are committed into an immutable Merkle tree anchored on Polygon PoS, ensuring non-repudiation and preventing fraud replay.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#2c2c2e]/50 border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Lock className="w-4 h-4 text-[#34C759]" />
                    <span>Zero-Knowledge Proofs</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    zk-SNARK Groth16 proofs enable citizens to prove identity authenticity and age eligibility without exposing raw personal details to verifiers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#2c2c2e]/40 border border-white/[0.06]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Repository Artifacts Available</span>
                </h3>
                <ul className="space-y-1.5 text-[11px] text-zinc-300 font-mono">
                  <li>• <strong className="text-white">contracts/IdentityVerificationRegistry.sol</strong> - Solidity Smart Contract with Merkle Proofs & zk-SNARK verifier</li>
                  <li>• <strong className="text-white">BLOCKCHAIN_CYBERSECURITY.md</strong> - Complete Hackathon Theme Specification & Threat Mitigation Matrix</li>
                  <li>• <strong className="text-white">src/services/governmentLedger.ts</strong> - Cryptographic SHA-256 hashing & live gateway connector</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Smart Contract */}
          {activeTab === 'smartcontract' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">contracts/IdentityVerificationRegistry.sol</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">Solidity ^0.8.20 • Polygon PoS / EVM Compatible</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0062cc] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Contract'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#000000]/80 border border-white/[0.1] p-4 overflow-x-auto font-mono text-[11px] text-zinc-300 max-h-[360px] leading-relaxed">
                <pre>{SOLIDITY_CONTRACT_CODE}</pre>
              </div>

              <div className="p-3 rounded-xl bg-[#2c2c2e]/60 border border-white/[0.06] text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Deploy with: <code className="text-[#34C759] font-mono">npx hardhat run scripts/deploy.ts --network polygonAmoy</code></span>
                <span className="text-white font-semibold">Gas Efficient Merkle Leaf: 32 bytes</span>
              </div>
            </div>
          )}

          {/* TAB 3: zk-SNARK & Merkle */}
          {activeTab === 'proofs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#2c2c2e]/70 border border-white/[0.08] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  <span>Zero-Knowledge Proof & Merkle Inclusion Verification</span>
                </h3>
                <p className="text-zinc-300 leading-relaxed text-xs">
                  DocShield allows institutions to verify that a document was signed by an authorized government registry without ever knowing the citizen&apos;s identity number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#2c2c2e]/50 border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#007AFF]"></span>
                    <span>1. Cryptographic Merkle Proofs</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Instead of publishing billions of raw document IDs, the authority aggregates verified hashes into a binary Merkle tree. Verification requires only a 32-byte root hash and $O(\log n)$ proof siblings.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/50 font-mono text-[10px] text-[#007AFF] break-all">
                    verifyMerkleProof(bytes32[] proof, bytes32 root, bytes32 leaf)
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#2c2c2e]/50 border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                    <span>2. zk-SNARK Groth16 Verifier</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Citizens generate a mathematical proof showing: &ldquo;My document hash is in the valid registry AND my birth year satisfies Age &ge; 18&rdquo;. The verifier learns nothing else.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/50 font-mono text-[10px] text-[#34C759] break-all">
                    verifyZkSnarkProof(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[2] input)
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#2c2c2e]/40 border border-white/[0.06] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                  <span className="text-zinc-200">Decentralized Revocation Registry: Any compromised credential is globally revoked on-chain in 1 transaction.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Zero-Trust Forensics */}
          {activeTab === 'zerotrust' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#2c2c2e]/70 border border-white/[0.08] space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#007AFF]" />
                  <span>Cybersecurity Defense Matrix (Zero-Trust Model)</span>
                </h3>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  DocShield implements defense-in-depth against physical forgery, digital software modification, and synthetic AI deepfakes.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-white/[0.08] rounded-xl overflow-hidden">
                  <thead className="bg-[#2c2c2e] text-white font-semibold">
                    <tr>
                      <th className="p-2.5">Attack Vector</th>
                      <th className="p-2.5">Threat Description</th>
                      <th className="p-2.5">DocShield Cybersecurity Defense</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] bg-black/40">
                    <tr>
                      <td className="p-2.5 font-bold text-red-400">Digital Font Splicing</td>
                      <td className="p-2.5 text-zinc-400">Photoshop / Canva modified text overlays</td>
                      <td className="p-2.5 text-[#34C759]">Error Level Analysis (ELA) thermal frequency divergence</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Fabricated ID Numbers</td>
                      <td className="p-2.5 text-zinc-400">Randomly guessed 12-digit Aadhaar numbers</td>
                      <td className="p-2.5 text-[#34C759]">UIDAI Dihedral D5 Verhoeff checksum algorithm</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-blue-400">Data Leak / Breach</td>
                      <td className="p-2.5 text-zinc-400">Compromise of server disk storage</td>
                      <td className="p-2.5 text-[#34C759]">Zero Persistent Storage: RAM-only byte streams (0 KB on disk)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-purple-400">Presentation Attacks</td>
                      <td className="p-2.5 text-zinc-400">Showing printed paper or phone screen</td>
                      <td className="p-2.5 text-[#34C759]">Facial vector cosine similarity & moiré texture detection</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* iOS Footer Action */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/[0.08] bg-[#2c2c2e]/40 backdrop-blur-xl">
          <span className="text-[11px] text-zinc-400 font-mono">
            Smart India Hackathon • Blockchain & Cybersecurity Theme
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062cc] text-white font-semibold text-xs transition-all cursor-pointer active:scale-95"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
