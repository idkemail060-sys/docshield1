/**
 * DocShield - Verhoeff Algorithm Implementation & Identity Rules
 * Reference: UIDAI Aadhaar Authentication Guidelines & ISO/IEC 7064, MOD 11, 10
 */

// Multiplication table d
const d_table: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Permutation table p
const p_table: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

// Inverse table inv
const inv_table: number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a numeric string using the Verhoeff algorithm (UIDAI standard).
 * @param numStr 12-digit Aadhaar or numeric identity string
 * @returns boolean true if checksum passes
 */
export function validateVerhoeff(numStr: string): boolean {
  const clean = numStr.replace(/[\s-]+/g, '');
  if (!clean || !/^\d+$/.test(clean)) return false;

  let c = 0;
  const digits = clean.split('').reverse().map(Number);

  for (let i = 0; i < digits.length; i++) {
    c = d_table[c][p_table[i % 8][digits[i]]];
  }

  return c === 0;
}

/**
 * Generates the Verhoeff check digit for an 11-digit string.
 */
export function generateVerhoeffCheckDigit(numStr: string): number {
  const clean = numStr.replace(/[\s-]+/g, '');
  let c = 0;
  const digits = clean.split('').reverse().map(Number);

  for (let i = 0; i < digits.length; i++) {
    c = d_table[c][p_table[(i + 1) % 8][digits[i]]];
  }

  return inv_table[c];
}

/**
 * Indian PAN Card format validation:
 * Must be 10 characters: 5 uppercase letters + 4 digits + 1 uppercase letter.
 * 4th character denotes entity type (P = Individual, C = Company, etc.)
 */
export function validatePanCard(panStr: string): { isValid: boolean; message: string; entityType?: string } {
  const clean = panStr.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Invalid PAN structure: Expected 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)'
    };
  }

  const fourthChar = clean[3];
  const entityMap: Record<string, string> = {
    P: 'Individual / Person',
    C: 'Company',
    H: 'Hindu Undivided Family (HUF)',
    A: 'Association of Persons (AOP)',
    B: 'Body of Individuals (BOI)',
    G: 'Government Agency',
    J: 'Artificial Juridical Person',
    L: 'Local Authority',
    F: 'Firm / Limited Liability Partnership',
    T: 'Trust'
  };

  const entity = entityMap[fourthChar] || 'Unknown Entity';
  return {
    isValid: true,
    message: `Valid PAN format: 4th character '${fourthChar}' indicates ${entity}`,
    entityType: entity
  };
}

/**
 * Validates Indian Passport Number format:
 * Standard format: 1 letter (except Q, X, Z) followed by 7 digits.
 */
export function validateIndianPassport(passportStr: string): { isValid: boolean; message: string } {
  const clean = passportStr.trim().toUpperCase();
  const passportRegex = /^[A-PR-WYa-pr-wy][0-9]{7}$/;

  if (!passportRegex.test(clean)) {
    return {
      isValid: false,
      message: 'Invalid Passport format: Must start with a letter followed by 7 numeric digits'
    };
  }

  return {
    isValid: true,
    message: 'Valid Passport serial pattern conforming to ICAO Doc 9303'
  };
}

/**
 * ICAO Doc 9303 MRZ (Machine Readable Zone) checksum calculation
 */
export function computeMrzCheckDigit(mrzStr: string): number {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < mrzStr.length; i++) {
    const char = mrzStr[i];
    let val = 0;
    if (char >= '0' && char <= '9') {
      val = parseInt(char, 10);
    } else if (char >= 'A' && char <= 'Z') {
      val = char.charCodeAt(0) - 55;
    } else if (char === '<') {
      val = 0;
    }
    sum += val * weights[i % 3];
  }
  return sum % 10;
}
