"""
DocShield - Verhoeff Checksum & Identification Validation
Reference: UIDAI Aadhaar Authentication Guidelines & ISO/IEC 7064, MOD 11, 10
"""

import re
from typing import Dict, Any, Tuple

# Dihedral group D5 multiplication table d
D_TABLE = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

# Permutation table p
P_TABLE = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

# Inverse table inv
INV_TABLE = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]


def validate_verhoeff(number_str: str) -> bool:
    """
    Validates a number string using the Verhoeff algorithm.
    Used for 12-digit Indian Aadhaar validation.
    """
    clean_num = re.sub(r'[\s-]+', '', str(number_str))
    if not clean_num.isdigit():
        return False

    c = 0
    reversed_digits = [int(d) for d in reversed(clean_num)]

    for i, digit in enumerate(reversed_digits):
        c = D_TABLE[c][P_TABLE[i % 8][digit]]

    return c == 0


def generate_verhoeff(number_str: str) -> int:
    """
    Generates the check digit for an 11-digit base number.
    """
    clean_num = re.sub(r'[\s-]+', '', str(number_str))
    c = 0
    reversed_digits = [int(d) for d in reversed(clean_num)]

    for i, digit in enumerate(reversed_digits):
        c = D_TABLE[c][P_TABLE[(i + 1) % 8][digit]]

    return INV_TABLE[c]


def validate_pan(pan_str: str) -> Tuple[bool, str]:
    """
    Validates Indian Permanent Account Number (PAN) format:
    Pattern: [A-Z]{5}[0-9]{4}[A-Z]{1}
    4th character must match known entity codes:
    P = Individual, C = Company, H = HUF, F = Firm, etc.
    """
    clean_pan = pan_str.strip().upper()
    pan_regex = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'

    if not re.match(pan_regex, clean_pan):
        return False, "Invalid PAN regex: Must be 5 letters, 4 digits, 1 letter"

    valid_entities = {'P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T'}
    fourth_char = clean_pan[3]
    if fourth_char not in valid_entities:
        return False, f"Invalid 4th character entity '{fourth_char}' in PAN"

    return True, f"Valid PAN format (Entity: {fourth_char})"


def validate_passport(passport_str: str) -> Tuple[bool, str]:
    """
    Validates Indian Passport number format (1 letter + 7 digits, ICAO Doc 9303).
    """
    clean = passport_str.strip().upper()
    passport_regex = r'^[A-PR-WYa-pr-wy][0-9]{7}$'

    if not re.match(passport_regex, clean):
        return False, "Invalid Passport format: Expected 1 letter followed by 7 digits"

    return True, "Valid Passport number pattern"
