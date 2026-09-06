# DocShield — AI-Based Fake Identity and Document Screening System
**Smart India Hackathon 2026 (Problem Statement SIH26188, Category: Software)**

---

## 1. Project Folder Structure

```
DocShield/
├── backend/                        # FastAPI Python Core Backend
│   ├── main.py                     # API routes, in-memory stream lifecycle, CORS
│   ├── requirements.txt            # Python dependencies (PyTorch, OpenCV, Pillow, FastAPI)
│   ├── Dockerfile                  # Containerized deployment spec
│   ├── docker-compose.yml          # Docker composition spec
│   └── pipeline/                   # Modular verification & forensic stages
│       ├── __init__.py
│       ├── verhoeff.py             # ISO/IEC 7064 Dihedral D5 Aadhaar checksum & PAN regex
│       ├── forensics.py            # Error Level Analysis (ELA), EXIF audit, Laplacian blur
│       ├── ocr_engine.py           # PaddleOCR / Tesseract field extraction & classification
│       ├── biometrics.py           # Face detection, landmark embeddings & liveness check
│       └── risk_engine.py          # Multi-signal weighted risk scoring model
│
├── src/                            # React.js Modern UI Frontend
│   ├── App.tsx                     # Main App layout & navigation
│   ├── types.ts                    # Global TypeScript interfaces & schemas
│   ├── index.css                   # Tailwind CSS styling
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation & Privacy status bar
│   │   ├── DocumentUploader.tsx    # Upload dropzone + live webcam selfie capture
│   │   ├── PipelineProgress.tsx    # Real-time animated stage tracker
│   │   ├── ResultsView.tsx         # Explainable score, ELA heatmap & biometric match
│   │   ├── AdminDashboard.tsx      # Fraud analytics & in-memory audit logs
│   │   ├── BackendCodeViewer.tsx   # Interactive backend architecture code inspector
│   │   └── ComplianceModal.tsx     # UIDAI, NIST SP 800-63A, ICAO compliance specs
│   └── services/
│       ├── analyzer.ts             # Client-side screening orchestrator
│       ├── verhoeff.ts             # TypeScript Verhoeff D8 implementation
│       └── sampleData.ts           # Pre-configured genuine and tampered test vectors
│
├── package.json                    # Node.js project manifest
├── vite.config.ts                  # Vite build configuration
└── metadata.json                   # Applet permissions and metadata
```

---

## 2. In-Memory / RAM-Only Processing Notes & Privacy Guarantees

DocShield is designed to satisfy the strictest data privacy standards (including **NIST SP 800-63A** Identity Proofing and **UIDAI Aadhaar Data Security Guidelines**):

1. **Zero Disk I/O**: Uploaded documents and live selfie images are received exclusively via asynchronous memory streams (`UploadFile.read()`) into `io.BytesIO` buffers. No temporary files (`/tmp`) or database blobs are ever written to disk.
2. **Explicit Garbage Collection**: Immediately after downstream analysis completes, memory buffers are explicitly dereferenced using `del doc_bytes` and `del selfie_bytes`, followed by `gc.collect()` in a `finally:` block.
3. **Metadata-Only Audit Logs**: Only non-sensitive operational telemetry is retained for compliance:
   - Request UUID / Timestamp
   - Document Type (e.g. Aadhaar, PAN)
   - Authenticity Score (0-100) & Decision (ACCEPT / MANUAL_REVIEW / REJECT)
   - Flag Summary (e.g., "Verhoeff check failed", "Photoshop signature detected")
   - Execution Time in milliseconds
   *No citizen names, raw ID numbers, or biometric face vectors are stored.*

---

## 3. Reference Standards

- **UIDAI Aadhaar Authentication Guidelines**: ISO/IEC 7064, Mod 11, 10 Verhoeff dihedral algorithm for 12-digit UID verification; Face Authentication directives.
- **NIST SP 800-63A / 63-4**: Digital Identity Guidelines, Identity Assurance Level (IAL2/IAL3), presentation attack detection (PAD).
- **ICAO Doc 9303**: Machine Readable Travel Documents (MRTD), Machine Readable Zone (MRZ) checksum validation.
