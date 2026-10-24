// Card helpers for the demo checkout. Used only in the browser: the full card
// number, expiry and CVC never leave it. The server receives brand + last four.

export type CardBrand = "Visa" | "Mastercard" | "American Express" | "Card";

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  return "Card";
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** "4242424242424242" → "4242 4242 4242 4242"; Amex groups 4-6-5. */
export function formatCardNumber(value: string) {
  const digits = onlyDigits(value);
  if (detectBrand(digits) === "American Express") {
    const d = digits.slice(0, 15);
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(" ");
  }
  return digits
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "1228" → "12 / 28" as the user types. */
export function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

/** Luhn checksum: catches typos in the card number. */
function passesLuhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export type CardInput = { number: string; expiry: string; cvc: string; name: string };
export type CardErrors = Partial<Record<keyof CardInput, string>>;

export function validateCard(card: CardInput, now = new Date()): CardErrors {
  const errors: CardErrors = {};
  const digits = onlyDigits(card.number);
  const brand = detectBrand(digits);

  const length = brand === "American Express" ? 15 : 16;
  if (digits.length === 0) errors.number = "Enter your card number.";
  else if (digits.length < length || !passesLuhn(digits)) {
    errors.number = "Your card number is incomplete or invalid.";
  }

  const [mm, yy] = card.expiry.split("/").map((s) => Number(s.trim()));
  if (!mm || yy === undefined || Number.isNaN(yy)) {
    errors.expiry = "Enter the expiry date.";
  } else if (mm < 1 || mm > 12) {
    errors.expiry = "Enter a valid month.";
  } else {
    // Valid through the last day of the expiry month.
    const expiresAt = new Date(2000 + yy, mm, 1);
    if (expiresAt <= now) errors.expiry = "Your card has expired.";
  }

  const cvcLength = brand === "American Express" ? 4 : 3;
  if (onlyDigits(card.cvc).length !== cvcLength) {
    errors.cvc = `Enter the ${cvcLength}-digit security code.`;
  }

  if (!card.name.trim()) errors.name = "Enter the name on the card.";
  return errors;
}
