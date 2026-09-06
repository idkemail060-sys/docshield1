"""
DocShield - Explainable Risk Scoring & Decision Engine
Combines multi-modal signals:
1. Structural Format & Checksums (Verhoeff / PAN Regex): 30%
2. AI Image Forensics (ELA compression delta & anomaly count): 30%
3. Biometric Face Match & Liveness: 30%
4. Metadata Integrity (EXIF software inspection): 10%
"""

from typing import Dict, Any, List, Tuple


def compute_authenticity_score(
    checksum_passed: bool,
    ela_anomaly_detected: bool,
    exif_software_flagged: bool,
    biometric_match_pct: float,
    liveness_passed: bool,
    quality_blur_variance: float
) -> Dict[str, Any]:
    """
    Computes a weighted 0-100 authenticity score and maps it to risk categories.
    Higher score = more authentic (Low Risk).
    """
    # 1. Structural Checksum Sub-score (0-100)
    structural_score = 100.0 if checksum_passed else 25.0

    # 2. Forensics & ELA Sub-score (0-100)
    forensics_score = 30.0 if ela_anomaly_detected else 96.0

    # 3. Biometric Sub-score (0-100)
    base_bio = max(0.0, min(100.0, biometric_match_pct))
    if not liveness_passed:
        base_bio *= 0.70 # penalty for failing liveness
    biometrics_score = base_bio

    # 4. Metadata & Quality Sub-score (0-100)
    meta_score = 40.0 if exif_software_flagged else 95.0
    if quality_blur_variance < 80.0:
        meta_score -= 20.0
    meta_score = max(0.0, meta_score)

    # Weighted Overall Calculation:
    # 30% Structural + 30% Forensics + 30% Biometrics + 10% Metadata
    overall_score = (
        0.30 * structural_score +
        0.30 * forensics_score +
        0.30 * biometrics_score +
        0.10 * meta_score
    )
    overall_score = round(max(0.0, min(100.0, overall_score)), 1)

    # Decision classification
    reasons = []
    if not checksum_passed:
        reasons.append("Structural verification failed: ID number checksum (Verhoeff/Regex) does not match valid mathematical algorithm.")
    if ela_anomaly_detected:
        reasons.append("Forensic Error Level Analysis detected high-frequency compression boundaries indicating spliced text or image modification.")
    if exif_software_flagged:
        reasons.append("File metadata contains tags from photo editing applications (e.g., Photoshop/Canva) rather than native optical sensor capture.")
    if biometric_match_pct < 60.0:
        reasons.append(f"Biometric similarity is below threshold ({biometric_match_pct:.1f}% vs 60.0% cutoff). Document holder may not match presenter.")
    if not liveness_passed:
        reasons.append("Biometric presentation attack suspected: Liveness test failed (potential screen replay or static photo spoof).")

    if overall_score >= 80.0:
        risk_level = "LOW_RISK"
        decision = "ACCEPT"
        recommendation = "Low risk. Document integrity verified across OCR, ELA forensics, and biometric face match. Auto-approval recommended."
    elif overall_score >= 50.0:
        risk_level = "MEDIUM_RISK"
        decision = "MANUAL_REVIEW"
        recommendation = "Medium risk. Borderline forensic or biometric signals detected. Route to Level-2 KYC compliance officer for secondary manual review."
    else:
        risk_level = "HIGH_RISK"
        decision = "REJECT"
        recommendation = "High risk / Suspicious. Multiple failure flags detected in tamper analysis and checksum validation. Reject application."

    return {
        "authenticity_score": overall_score,
        "risk_level": risk_level,
        "decision": decision,
        "recommendation": recommendation,
        "reasons": reasons,
        "sub_scores": {
            "structural": round(structural_score, 1),
            "forensics": round(forensics_score, 1),
            "biometrics": round(biometrics_score, 1),
            "metadata": round(meta_score, 1)
        }
    }
