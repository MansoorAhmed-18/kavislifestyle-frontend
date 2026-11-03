/**
 * Shared validation rules for Kavi's Lifestyle
 * Rule 1: Email must strictly end with @gmail.com and only contain small (lowercase) letters.
 * Rule 2: Phone number must strictly be 10 numeric digits.
 */

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Email address is required.' };
  }
  if (/[A-Z]/.test(trimmed)) {
    return { isValid: false, message: 'Only small (lowercase) letters are allowed in email.' };
  }
  if (!trimmed.endsWith('@gmail.com')) {
    return { isValid: false, message: 'Email address must strictly end with @gmail.com.' };
  }
  // Suffix must be @gmail.com and prefix must be lowercase alphanumeric and standard symbols
  const gmailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid lowercase email ending with @gmail.com.' };
  }
  return { isValid: true };
};

export const validatePhone = (phone: string, isRequired: boolean = true): { isValid: boolean; message?: string } => {
  const trimmed = phone.trim();
  if (!trimmed) {
    if (isRequired) {
      return { isValid: false, message: 'Phone number is required.' };
    }
    return { isValid: true };
  }
  if (!/^\d{10}$/.test(trimmed)) {
    return { isValid: false, message: 'Phone number must be strictly 10 digits.' };
  }
  return { isValid: true };
};

/**
 * Filter phone input to strictly numbers, capped at 10 digits
 */
export const sanitizePhoneInput = (val: string): string => {
  return val.replace(/\D/g, '').slice(0, 10);
};

/**
 * Convert email input to lowercase and strip whitespace
 */
export const sanitizeEmailInput = (val: string): string => {
  return val.toLowerCase().replace(/\s/g, '');
};

