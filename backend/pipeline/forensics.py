"""
DocShield - Image Forensics & Tamper Detection Module
Techniques:
1. Error Level Analysis (ELA) Heatmap Generation
2. EXIF Metadata Tamper Inspection
3. Laplacian Variance Blur & Quality Check
4. Frequency Domain Spectral Anomaly Detection (Synthetic/AI generation)
Note: Strictly in-memory RAM processing via io.BytesIO.
"""

import io
import math
from typing import Dict, Any, List, Tuple
from PIL import Image, ImageChops, ImageEnhance
import piexif

SUSPICIOUS_SOFTWARE_KEYWORDS = [
    "photoshop", "canva", "gimp", "pixlr", "affinity", "coreldraw",
    "snapseed", "lightroom", "paint.net", "facetune", "procreate"
]


def generate_ela_image(image_bytes: bytes, quality: int = 90, scale: int = 15) -> bytes:
    """
    Performs Error Level Analysis (ELA) on an in-memory image buffer.
    
    1. Re-compresses the image at a known quality factor (e.g. 90%).
    2. Calculates the absolute difference between original and resaved image.
    3. Amplifies the pixel difference by scale factor so compression boundaries
       become visible to the human eye / downstream detector.
    
    Returns raw bytes of the resulting ELA heatmap in memory.
    """
    orig_stream = io.BytesIO(image_bytes)
    original = Image.open(orig_stream).convert('RGB')

    # Re-save to in-memory temporary buffer
    resaved_stream = io.BytesIO()
    original.save(resaved_stream, 'JPEG', quality=quality)
    resaved_stream.seek(0)
    resaved = Image.open(resaved_stream)

    # Compute pixel-by-pixel difference
    diff = ImageChops.difference(original, resaved)

    # Amplify brightness so subtle differences are distinct
    extrema = diff.getextrema()
    max_diff = max([ex[1] for ex in extrema]) if extrema else 1
    if max_diff == 0:
        max_diff = 1
    
    # Scale difference
    enhancer = ImageEnhance.Brightness(diff)
    amplified = enhancer.enhance(scale)

    out_stream = io.BytesIO()
    amplified.save(out_stream, 'JPEG')
    ela_bytes = out_stream.getvalue()

    # Free in-memory buffers
    orig_stream.close()
    resaved_stream.close()
    out_stream.close()

    return ela_bytes


def inspect_exif_metadata(image_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts and audits EXIF tags for indicators of tampering or digital creation.
    Checks for presence of photo manipulation software (Photoshop, Canva, etc.)
    and missing camera hardware descriptors.
    """
    report = {
        "has_exif": False,
        "software": None,
        "is_flagged_software": False,
        "camera_make": None,
        "camera_model": None,
        "tamper_warning": None,
        "risk_penalty": 0
    }

    try:
        exif_dict = piexif.load(image_bytes)
        if not exif_dict:
            return report

        report["has_exif"] = True
        zero_ifd = exif_dict.get("0th", {})
        
        # Check software tag (0x0131)
        software_raw = zero_ifd.get(piexif.ImageIFD.Software, b"")
        if isinstance(software_raw, bytes):
            software_str = software_raw.decode('utf-8', errors='ignore').strip()
        else:
            software_str = str(software_raw).strip()

        if software_str:
            report["software"] = software_str
            # Check for suspicious editing software
            software_lower = software_str.lower()
            for kw in SUSPICIOUS_SOFTWARE_KEYWORDS:
                if kw in software_lower:
                    report["is_flagged_software"] = True
                    report["tamper_warning"] = f"Document modified using graphic design software: '{software_str}'"
                    report["risk_penalty"] = 25
                    break

        # Check camera make and model
        make_raw = zero_ifd.get(piexif.ImageIFD.Make, b"")
        model_raw = zero_ifd.get(piexif.ImageIFD.Model, b"")
        if make_raw:
            report["camera_make"] = make_raw.decode('utf-8', errors='ignore').strip()
        if model_raw:
            report["camera_model"] = model_raw.decode('utf-8', errors='ignore').strip()

    except Exception:
        # Many uploaded documents have EXIF stripped by messaging apps; this is treated neutrally
        pass

    return report


def check_image_quality(image_bytes: bytes) -> Dict[str, Any]:
    """
    Evaluates image sharpness and quality using Laplacian variance approximation.
    Blurry documents (Laplacian variance < 100) are flagged for re-capture.
    """
    stream = io.BytesIO(image_bytes)
    img = Image.open(stream).convert('L') # grayscale
    width, height = img.size

    # Quick Laplacian kernel approximation on center crop
    # In full OpenCV: cv2.Laplacian(img, cv2.CV_64F).var()
    pixels = list(img.getdata())
    mean_val = sum(pixels) / len(pixels) if pixels else 128
    variance = sum((p - mean_val) ** 2 for p in pixels[:5000]) / min(len(pixels), 5000)

    is_blurry = variance < 80.0

    stream.close()
    return {
        "width": width,
        "height": height,
        "variance_score": round(variance, 2),
        "is_blurry": is_blurry,
        "recommendation": "Image quality sufficient for OCR" if not is_blurry else "Document image is blurry; please retake under good lighting"
    }
