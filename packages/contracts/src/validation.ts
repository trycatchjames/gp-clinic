/** Shared validation helpers used by both the API and the web client. */

/**
 * Validate an Australian Business Number using the ATO's modulus 89 checksum.
 * Catches a mistyped digit immediately. It does not verify the ABN exists —
 * that would be an ABR lookup, which is out of scope.
 */
export function isValidAbn(abn: string): boolean {
  const digits = abn.replace(/\s/g, '');
  if (!/^\d{11}$/.test(digits)) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const values = digits.split('').map(Number);
  values[0] -= 1;
  const sum = values.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  return sum % 89 === 0;
}

/** Validate an Australian Company Number using its modulus 10 checksum. */
export function isValidAcn(acn: string): boolean {
  const digits = acn.replace(/\s/g, '');
  if (!/^\d{9}$/.test(digits)) return false;
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  const values = digits.split('').map(Number);
  const sum = weights.reduce((acc, w, i) => acc + values[i] * w, 0);
  const check = (10 - (sum % 10)) % 10;
  return check === values[8];
}

/**
 * Validate a Medicare card number's check digit.
 * The 9th digit is a weighted modulus 10 check over the first eight.
 */
export function isValidMedicareNumber(number: string): boolean {
  const digits = number.replace(/\s/g, '');
  if (!/^\d{10}$/.test(digits)) return false;
  if (!/^[2-6]/.test(digits)) return false;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9];
  const values = digits.split('').map(Number);
  const sum = weights.reduce((acc, w, i) => acc + values[i] * w, 0);
  return sum % 10 === values[8];
}

/** Australian postcode: four digits. */
export function isValidPostcode(postcode: string): boolean {
  return /^\d{4}$/.test(postcode.trim());
}

/** Australian mobile number, tolerant of spaces and +61. */
export function isValidAustralianMobile(phone: string): boolean {
  const digits = phone.replace(/[\s()-]/g, '').replace(/^\+61/, '0');
  return /^04\d{8}$/.test(digits);
}

export function formatAbn(abn: string): string {
  const d = abn.replace(/\s/g, '');
  if (d.length !== 11) return abn;
  return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
    cents / 100,
  );
}
