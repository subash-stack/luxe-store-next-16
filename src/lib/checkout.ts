// Checkout field rules shared by the form (browser) and `placeOrder` (server),
// so both accept exactly the same values.

export const DELIVERY_NOTE_MAX = 500;

export const EMAIL_MAX = 254;

/**
 * name@domain.tld: no leading, trailing or doubled dots in the name, domain
 * labels that don't start or end with a hyphen, and a letters-only TLD of 2+.
 */
const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+'-]+(?<!\.)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

/** Error message for an email address, or undefined when it's valid. */
export function emailError(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (email.length > EMAIL_MAX || !EMAIL_REGEX.test(email)) {
    return "Enter a valid email address, like name@example.com.";
  }
}

export const PHONE_MAX_LENGTH = 20;
const PHONE_MIN_DIGITS = 7;
/** E.164 allows at most 15 digits including the country code. */
const PHONE_MAX_DIGITS = 15;

/**
 * Keeps only what a phone number can contain: digits, spaces, ( ) - and a
 * single leading +. Applied as the shopper types, so letters never appear.
 */
export function sanitizePhone(value: string): string {
  const allowed = value.replace(/[^\d\s()+-]/g, "").trimStart();
  const leadingPlus = allowed.startsWith("+");
  return ((leadingPlus ? "+" : "") + allowed.replace(/\+/g, "")).slice(0, PHONE_MAX_LENGTH);
}

/** Error message for a phone number, or undefined when it's valid. */
export function phoneError(value: string): string | undefined {
  const phone = value.trim();
  if (!phone) return "Enter your phone number.";
  if (!/^\+?[\d\s()-]+$/.test(phone)) {
    return "Use digits, spaces and + ( ) - only.";
  }
  const digits = phone.replace(/\D/g, "").length;
  if (digits < PHONE_MIN_DIGITS || digits > PHONE_MAX_DIGITS) {
    return `Enter a valid phone number (${PHONE_MIN_DIGITS}–${PHONE_MAX_DIGITS} digits).`;
  }
}
