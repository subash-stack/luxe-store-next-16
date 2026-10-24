"use client";

import {
  startTransition,
  useActionState,
  useState,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { placeOrder, type CheckoutState } from "@/app/bag/actions";
import { Button } from "@/components/ui/button";
import {
  detectBrand,
  formatCardNumber,
  formatExpiry,
  onlyDigits,
  validateCard,
  type CardErrors,
  type CardInput,
} from "@/lib/card";
import {
  DELIVERY_NOTE_MAX,
  EMAIL_MAX,
  emailError,
  phoneError,
  sanitizePhone,
} from "@/lib/checkout";
import { cn } from "@/lib/cn";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "France",
  "Germany",
  "Italy",
  "India",
  "Japan",
  "Australia",
];

const initialState: CheckoutState = {};

type ContactField = "email" | "phone";
const contactRules: Record<ContactField, (value: string) => string | undefined> = {
  email: emailError,
  phone: phoneError,
};

export function CheckoutForm({ totalLabel }: { totalLabel: string }) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);
  const [card, setCard] = useState<CardInput>({ number: "", expiry: "", cvc: "", name: "" });
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  // Contact errors show once a field has been left, then update as it's edited.
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [contactErrors, setContactErrors] = useState<Partial<Record<ContactField, string>>>({});
  // Every required field filled and passing its native constraints. Card
  // format checks (Luhn, expiry date) still run on submit.
  const [complete, setComplete] = useState(false);
  const brand = detectBrand(onlyDigits(card.number));
  const fieldErrors = state.fieldErrors ?? {};

  // Runs the shared rule and mirrors it into the browser's validity, so the
  // Confirm button (checkValidity) agrees with what the server accepts.
  function checkContact(input: HTMLInputElement, field: ContactField, value = input.value) {
    const message = contactRules[field](value);
    input.setCustomValidity(message ?? "");
    setContactErrors((e) => ({ ...e, [field]: message }));
    // The form's onInput runs before this onChange, so re-check here too.
    if (input.form) setComplete(input.form.checkValidity());
  }

  function blurContact(event: FocusEvent<HTMLInputElement>, field: ContactField) {
    setTouched((t) => ({ ...t, [field]: true }));
    checkContact(event.currentTarget, field);
  }

  const emailMessage = touched.email ? contactErrors.email : fieldErrors.email;
  const phoneMessage = touched.phone ? contactErrors.phone : fieldErrors.phone;

  function update(key: keyof CardInput, value: string) {
    setCard((c) => ({ ...c, [key]: value }));
    if (cardErrors[key]) setCardErrors((e) => ({ ...e, [key]: undefined }));
  }

  // onSubmit rather than <form action>: React resets an action form's fields
  // after it runs, which would wipe the shopper's details on a server error.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateCard(card);
    setCardErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Card inputs have no `name`, so FormData never contains them; only the
    // brand and last four digits are added for the order record.
    const formData = new FormData(event.currentTarget);
    formData.set("cardBrand", brand);
    formData.set("cardLast4", onlyDigits(card.number).slice(-4));
    startTransition(() => formAction(formData));
  }

  return (
    <form
      onSubmit={handleSubmit}
      // Select changes and browser autofill fire `input` too, so this covers every field.
      onInput={(e) => setComplete(e.currentTarget.checkValidity())}
      className="space-y-12"
    >
      <FormSection title="Contact">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" name="email" error={emailMessage}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={EMAIL_MAX}
              onChange={(e) => checkContact(e.currentTarget, "email")}
              onBlur={(e) => blurContact(e, "email")}
              aria-invalid={Boolean(emailMessage)}
              aria-describedby={emailMessage ? "email-error" : undefined}
              className="field"
            />
          </Field>
          <Field label="Phone" name="phone" error={phoneMessage}>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              required
              // No maxLength: it would cut pasted text before letters are stripped.
              // sanitizePhone caps the cleaned value at PHONE_MAX_LENGTH instead.
              value={phone}
              onChange={(e) => {
                // Letters and other symbols are dropped as they're typed or pasted.
                const next = sanitizePhone(e.target.value);
                setPhone(next);
                checkContact(e.currentTarget, "phone", next);
              }}
              onBlur={(e) => blurContact(e, "phone")}
              aria-invalid={Boolean(phoneMessage)}
              aria-describedby={phoneMessage ? "phone-error" : undefined}
              className="field"
            />
          </Field>
        </div>
        <Field
          label="Delivery note (optional)"
          name="deliveryNote"
          error={fieldErrors.deliveryNote}
        >
          <textarea
            id="deliveryNote"
            name="deliveryNote"
            rows={4}
            maxLength={DELIVERY_NOTE_MAX}
            placeholder="Gate code, safe place to leave it, building access…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-invalid={Boolean(fieldErrors.deliveryNote)}
            aria-describedby={
              fieldErrors.deliveryNote ? "deliveryNote-hint deliveryNote-error" : "deliveryNote-hint"
            }
            className="field field-textarea"
          />
          <p id="deliveryNote-hint" className="field-hint flex justify-between gap-4">
            <span>Shared with the courier only.</span>
            <span className="tabular-nums">
              {note.length}/{DELIVERY_NOTE_MAX}
            </span>
          </p>
        </Field>
      </FormSection>

      <FormSection title="Shipping address">
        <Field label="Full name" name="shippingName" error={fieldErrors.shippingName}>
          <input id="shippingName" name="shippingName" autoComplete="name" required className="field" />
        </Field>
        <Field label="Address" name="addressLine1" error={fieldErrors.addressLine1}>
          <input
            id="addressLine1"
            name="addressLine1"
            autoComplete="address-line1"
            required
            className="field"
          />
        </Field>
        <Field label="Apartment, suite (optional)" name="addressLine2">
          <input id="addressLine2" name="addressLine2" autoComplete="address-line2" className="field" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="City" name="city" error={fieldErrors.city}>
            <input id="city" name="city" autoComplete="address-level2" required className="field" />
          </Field>
          <Field label="Postcode" name="postalCode" error={fieldErrors.postalCode}>
            <input
              id="postalCode"
              name="postalCode"
              autoComplete="postal-code"
              required
              className="field"
            />
          </Field>
        </div>
        <Field label="Country" name="country" error={fieldErrors.country}>
          <select
            id="country"
            name="country"
            autoComplete="country-name"
            defaultValue="United States"
            className="field"
          >
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </FormSection>

      <FormSection title="Payment">
        <p className="border border-line bg-surface px-4 py-3 text-caption text-ink-muted">
          Demo checkout: no payment is taken and card details never leave your browser.
          Use test card <span className="tabular-nums text-ink">4242 4242 4242 4242</span>,
          any future date and any CVC. Don&apos;t enter a real card.
        </p>

        {/* Stripe-style grouped card field: number on top, expiry and CVC below. */}
        <fieldset>
          <legend className="field-label">Card information</legend>
          <div
            className={cn(
              "border transition-colors duration-(--duration-fast) focus-within:border-ink",
              cardErrors.number || cardErrors.expiry || cardErrors.cvc
                ? "border-danger"
                : "border-line hover:border-ink-subtle",
            )}
          >
            <div className="relative">
              <label htmlFor="cardNumber" className="sr-only">
                Card number
              </label>
              <input
                id="cardNumber"
                inputMode="numeric"
                autoComplete="off"
                required
                placeholder="1234 1234 1234 1234"
                value={card.number}
                onChange={(e) => update("number", formatCardNumber(e.target.value))}
                aria-invalid={Boolean(cardErrors.number)}
                aria-describedby="card-errors"
                className="h-12 w-full bg-transparent px-4 pr-32 tabular-nums placeholder:text-ink-subtle focus-visible:outline-none"
              />
              <span
                aria-live="polite"
                className="type-label pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-subtle"
              >
                {brand === "Card" ? "" : brand}
              </span>
            </div>
            <div className="grid grid-cols-2 border-t border-line">
              <div>
                <label htmlFor="cardExpiry" className="sr-only">
                  Expiry date, month and year
                </label>
                <input
                  id="cardExpiry"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  placeholder="MM / YY"
                  value={card.expiry}
                  onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                  aria-invalid={Boolean(cardErrors.expiry)}
                  aria-describedby="card-errors"
                  className="h-12 w-full bg-transparent px-4 tabular-nums placeholder:text-ink-subtle focus-visible:outline-none"
                />
              </div>
              <div className="border-l border-line">
                <label htmlFor="cardCvc" className="sr-only">
                  Security code
                </label>
                <input
                  id="cardCvc"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  placeholder="CVC"
                  value={card.cvc}
                  onChange={(e) =>
                    update("cvc", onlyDigits(e.target.value).slice(0, brand === "American Express" ? 4 : 3))
                  }
                  aria-invalid={Boolean(cardErrors.cvc)}
                  aria-describedby="card-errors"
                  className="h-12 w-full bg-transparent px-4 tabular-nums placeholder:text-ink-subtle focus-visible:outline-none"
                />
              </div>
            </div>
          </div>
          <div id="card-errors" aria-live="polite">
            {[cardErrors.number, cardErrors.expiry, cardErrors.cvc]
              .filter(Boolean)
              .map((message) => (
                <p key={message} className="field-error">
                  {message}
                </p>
              ))}
          </div>
        </fieldset>

        <Field label="Name on card" name="cardName" error={cardErrors.name}>
          <input
            id="cardName"
            autoComplete="off"
            required
            value={card.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(cardErrors.name)}
            className="field"
          />
        </Field>
      </FormSection>

      <div>
        {state.error && (
          <p role="alert" className="mb-4 border border-danger px-4 py-3 text-caption text-danger">
            {state.error}
          </p>
        )}
        <Button
          type="submit"
          block
          disabled={pending || !complete}
          aria-describedby={complete ? undefined : "confirm-hint"}
        >
          {pending ? "Processing…" : `Confirm payment · ${totalLabel}`}
        </Button>
        {!complete && (
          <p id="confirm-hint" className="field-hint">
            Fill in all required fields to confirm payment.
          </p>
        )}
        <p className="mt-4 text-caption text-ink-subtle">
          By confirming, you agree to our terms of sale. Complimentary returns within 30 days.
        </p>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="type-label mb-6">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(error && "[&_.field]:border-danger")}>
      <label htmlFor={name} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
