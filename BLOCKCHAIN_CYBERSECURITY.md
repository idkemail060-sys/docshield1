# DocShield: Blockchain & Cybersecurity Theme Specification (SIH26188)

## 1. Hackathon Problem Statement & Domain Alignment
- **Problem Statement ID:** SIH26188
- **Theme:** **Blockchain & Cybersecurity**
- **Category:** Software / Zero-Trust Identity Security & Decentralized Verification
- **Core Vision:** Eliminate identity fraud, counterfeit government credentials (Aadhaar, PAN, Passport, Voter ID, Driving License), and centralized honeypot security risks through a hybrid **Zero-Knowledge Blockchain Ledger** and **Cryptographic In-Memory Screening Pipeline**.

---

## 2. Core Cybersecurity Pillars

### Pillar A: Zero-Trust & In-Memory Ephemeral Forensics (0 KB Persistent Disk Storage)
Centralized KYC databases that store citizen scans or face images become prime targets for ransomware, credential stuffing, and data breaches.
- **Volatile Streams Only:** Uploaded document images are received as in-memory byte arrays (`io.BytesIO`). They are never written to `/tmp`, local disks, or cloud storage buckets.
- **Explicit Garbage Collection:** References are dereferenced (`gc.collect()`) immediately upon generating the forensic digest.
- **Privacy-Preserving Audit Logs:** Only anonymous cryptographic hashes, risk scores, and mathematical reason codes are retained.

### Pillar B: Multi-Layer Anti-Tampering Forensic Engine
- **Error Level Analysis (ELA):** Detects digital image manipulation (spliced fonts, modified dates of birth, copy-pasted photo heads) by computing JPEG re-compression divergence across 8x8 DCT quantization grids.
- **Cryptographic Checksum Permutation:** 
  - **UIDAI Aadhaar:** Enforces the Dihedral group $D_5$ Verhoeff algorithm ($D_5 \cong \mathbb{Z}_{10} \rtimes \mathbb{Z}_2$) to catch 100% of single-digit substitutions and adjacent transposition errors.
  - **ICAO Doc 9303 MRZ:** Computes 7-3-1 weight algorithms for travel document machine-readable zones.
  - **CBDT / NSDL PAN:** RegEx structural validation with entity-type checksum verification.
- **EXIF & Hex Header Inspection:** Flags images produced by photo-editing software (Photoshop, Canva, GIMP, Figma) or missing authentic camera sensor optical metadata.
- **Biometric Presentation Attack Detection (PAD):** Evaluates face vector cosine similarity (NIST IAL2) and checks for screen moiré texture artifacts.

---

## 3. Core Blockchain Architecture

### Pillar C: Decentralized Verifiable Credential Registry
To prevent credential replay, double-issuance, and fraudulent document modification, DocShield integrates with a public/consortium EVM-compatible ledger (e.g., Polygon PoS / Hyperledger Besu):
1. **Cryptographic Fingerprinting:** When an authentic credential is processed, its immutable SHA-256 / Keccak-256 fingerprint is recorded on-chain via `IdentityVerificationRegistry.sol`.
2. **Merkle Proof Inclusion:** Batches of verified documents are rolled up into Merkle trees. Verifiers can submit an $O(\log n)$ cryptographic Merkle branch proof to verify a document’s status without querying a centralized government server.
3. **Decentralized Revocation Registry:** If a document is reported stolen or forged, an authorized authority calls `revokeCredential(bytes32 documentDigest)`. Any subsequent verification immediately fails globally across all relying parties.

### Pillar D: Zero-Knowledge Proofs (zk-SNARKs) for Selective Disclosure
In accordance with modern cybersecurity and privacy regulations (DPDP Act 2023):
- A citizen can prove they are **over 18 years old** or possess a **valid UIDAI credential** without revealing their full name, birth date, or 12-digit Aadhaar number to third-party verifiers.
- Groth16 circuit verification (`verifyZkSnarkProof`) executed on-chain or off-chain validates public inputs against cryptographic commitment proofs.

---

## 4. Smart Contract Details (`contracts/IdentityVerificationRegistry.sol`)

| Component | Specification |
| :--- | :--- |
| **Language & Version** | Solidity `^0.8.20` |
| **Standard** | ERC-735 / W3C Decentralized Identity (DID) Revocation Standard |
| **Gas Efficiency** | Merkle tree batching reduces on-chain storage to a single 32-byte root hash |
| **Access Control** | Multi-sig authorized verifier nodes with role-based governance |
| **Events Emitted** | `CredentialRegistered`, `CredentialRevoked`, `MerkleRootPublished`, `ZkProofVerified` |

---

## 5. Security & Threat Mitigation Matrix

| Attack Vector | Traditional KYC Weakness | DocShield Cybersecurity Defense |
| :--- | :--- | :--- |
| **Photoshop / Canva Font Splicing** | Blindly accepted by basic OCR | **Error Level Analysis (ELA)** thermal map reveals high-frequency compression spikes. |
| **Random / Fake Aadhaar Numbers** | Stored in database without check | **Verhoeff $D_5$ algorithm** rejects mathematically invalid check digits in real time. |
| **Identity Replay / Stolen Document** | Re-used across multiple platforms | **Blockchain registry** validates Merkle root & ensures unrevoked status. |
| **Database Compromise / Leak** | Plaintext citizen scans leaked | **RAM-only architecture** leaves zero document files on disk. |
| **Presentation Attack (Paper / Screen)** | Photo bypasses camera checks | **Cosine distance + Moiré frequency** verifies genuine biological liveness. |

---

## 6. How to Deploy & Verify Smart Contract

```bash
# 1. Compile with Hardhat or Foundry
npx hardhat compile

# 2. Deploy to Polygon Amoy / Sepolia Testnet
npx hardhat run scripts/deploy.ts --network polygonAmoy

# 3. Verify on Block Explorer
npx hardhat verify --network polygonAmoy <CONTRACT_ADDRESS>
```
